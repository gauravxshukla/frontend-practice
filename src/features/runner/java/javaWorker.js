/* global importScripts, cheerpjInit, cheerpjRunMain, cheerpOSAddStringFile, cjFileBlob */
// Long-lived Java worker: CheerpJ (a JVM in the browser) plus javac. It has to be
// a worker: CheerpJ runs Java on the thread that loads it, so an infinite loop on
// the main thread would freeze the tab. Here the main thread just terminates it.
// A classic worker, because CheerpJ's loader is a plain script for importScripts.
//
// Files: /str/<name> are in-memory inputs we write (flat: /str has no
// subdirectories, and javac needs each file named after its class, so a run
// overwrites the previous one's); /files/... is CheerpJ's persistent
// (IndexedDB) disk, where javac writes classes.

// CheerpJ prints the JVM's stdout/stderr (javac's diagnostics included) through console.
const output = [];
console.log = (...args) => output.push(args.join(' '));
console.error = console.log;

const encoder = new TextEncoder();
const write = (path, text) => cheerpOSAddStringFile(path, encoder.encode(text));
let harnessDir = null;

async function javac(sources, outDir) {
  output.length = 0;
  // -cp the (fresh) output directory, so nothing from earlier runs resolves.
  const args = [...sources, '-d', outDir, '-cp', outDir, '-implicit:none', '-encoding', 'UTF-8', '-g', '-nowarn'];
  const code = await cheerpjRunMain('com.sun.tools.javac.Main', '/files/', ...args);
  // CheerpJ prints text and its newline as separate calls.
  return { code, output: output.join('') };
}

/** Writes files to /str and returns the paths of the .java ones. */
function writeSources(files) {
  return Object.entries(files).map(([name, text]) => {
    write(`/str/${name}`, text);
    return `/str/${name}`;
  });
}

async function init({ loaderUrl, javaVersion, harness, hash }) {
  importScripts(loaderUrl);
  await cheerpjInit({ status: 'none', version: javaVersion });
  harnessDir = `/files/fp/harness-${hash}/`;
  // /files persists across visits, so each harness version compiles once.
  if (await cjFileBlob(`${harnessDir}FpHarness.class`)) return;
  const result = await javac(writeSources(harness), harnessDir);
  if (result.code !== 0) throw new Error(`The Java harness failed to compile:\n${result.output}`);
}

async function exec({ files, job, runId }) {
  const out = `/files/fp/run-${runId}/`;
  const sources = writeSources(files);
  write('/str/fp-job.json', job);

  const compiled = await javac(sources, out);
  if (compiled.code !== 0) return { type: 'compile-error', message: compiled.output };
  self.postMessage({ type: 'compiled' });

  output.length = 0;
  // The harness also deletes earlier run-* directories (pass /files/fp and our own name).
  await cheerpjRunMain('FpHarness', `${harnessDir}:${out}`, '/str/fp-job.json', `${out}result.json`, '/files/fp', `run-${runId}`);
  const blob = await cjFileBlob(`${out}result.json`);
  if (!blob) return { type: 'internal-error', message: output.join('') || 'The Java harness produced no result.' };
  return JSON.parse(await blob.text());
}

self.onmessage = async ({ data }) => {
  if (data.type === 'init') {
    try {
      await init(data);
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'init-error', message: String(error?.message ?? error) });
    }
  } else if (data.type === 'exec') {
    try {
      self.postMessage({ type: 'exec-result', result: await exec(data) });
    } catch (error) {
      // The JVM itself failed: the runtime restarts this worker.
      self.postMessage({ type: 'exec-result', fatal: true, result: { type: 'internal-error', message: String(error?.message ?? error) } });
    }
  }
};

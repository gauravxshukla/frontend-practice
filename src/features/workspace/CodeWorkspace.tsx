import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SandpackCodeEditor, SandpackProvider, useSandpack } from '@codesandbox/sandpack-react';
import { CloudUpload, Play, RotateCcw } from 'lucide-react';
import type { FileMap, Question, RunnerAssets } from '../../lib/content/catalog';
import { loadDraft } from '../../lib/drafts';
import { markAttempted, markSolved } from '../../lib/progress';
import { useTheme } from '../../lib/theme';
import { usePersistentState } from '../../lib/usePersistentState';
import { useRowResize } from '../../lib/useRowResize';
import { Kbd } from '../../components/Kbd';
import { useToast } from '../../components/overlay/ToastProvider';
import { isMac, modKey } from '../../lib/platform';
import { isLanguageId, languageInfo } from '../runner/languages/registry';
import type { LanguageId } from '../runner/languages/types';
import { useLanguageRuntime } from '../runner/languages/useLanguageRuntime';
import { runJob, type RunResponse } from '../runner/runJob';
import { javaStub } from '../runner/stubs/javaStub';
import { pythonStub } from '../runner/stubs/pythonStub';
import { toVerdict, type Verdict } from '../runner/verdict';
import DraftSaver from './DraftSaver';
import LanguageSelect from './LanguageSelect';
import ResultPanel from './ResultPanel';
import RuntimeStatus from './RuntimeStatus';
import { DsaTestcasePanel, JsTestcasePanel, toEditable, toRunnable, type EditableCase } from './TestcasePanel';
import { sandpackThemes } from './sandpackThemes';
import { useEditorLanguages } from './useEditorLanguages';

const JEST_LIMIT_MS = 6000;

interface Props {
  question: Question;
  assets: RunnerAssets;
  onAccepted: () => void;
}

/** Starter per language file. DSA questions get Python and Java too: a committed starter, else one generated from cases.json. */
function starterFiles(assets: RunnerAssets, multiLanguage: boolean): FileMap {
  const files: FileMap = { [languageInfo('javascript').file]: assets.starter };
  if (multiLanguage && assets.spec) {
    files[languageInfo('python').file] = assets.pyStarter ?? pythonStub(assets.spec, assets.starter);
    files[languageInfo('java').file] = assets.javaStarter ?? javaStub(assets.spec, assets.starter);
  }
  return files;
}

/** Tests a Run executes for JS questions: ones named "example…", else the first two. */
function exampleTests(names: string[]) {
  const examples = names.filter((n) => /(^|› )example/i.test(n));
  return examples.length ? examples : names.slice(0, 2);
}

interface InnerProps extends Props {
  language: LanguageId;
  /** Only DSA questions offer other languages; the JS track's Jest suites are JS by nature. */
  multiLanguage: boolean;
  onLanguageChange: (id: LanguageId) => void;
  starters: FileMap;
}

function Inner({ question, assets, onAccepted, language, multiLanguage, onLanguageChange, starters }: InnerProps) {
  const { sandpack } = useSandpack();
  const toast = useToast();
  const info = languageInfo(language);
  const { runtime, status, error } = useLanguageRuntime(language);
  const editorLanguages = useEditorLanguages(language);
  const codeRef = useRef('');
  codeRef.current = sandpack.files[info.file]?.code ?? '';

  // Every language's file lives in the sandbox; switching just changes which one is open,
  // so each keeps its own code (and draft).
  const { activeFile, openFile } = sandpack;
  useEffect(() => {
    if (activeFile !== info.file) openFile(info.file);
  }, [activeFile, openFile, info.file]);

  const spec = assets.spec;
  const initialCases = useMemo(
    () => (spec ? spec.cases.filter((c) => !c.hidden).map((c) => toEditable(spec, c)) : []),
    [spec],
  );
  const [cases, setCases] = useState<EditableCase[]>(initialCases);
  const [selectedCase, setSelectedCase] = useState(0);
  const [caseError, setCaseError] = useState<string>();
  const [testNames, setTestNames] = useState<string[]>([]);

  const [tab, setTab] = useState<'testcase' | 'result'>('testcase');
  const [running, setRunning] = useState<'run' | 'submit' | null>(null);
  const [lastMode, setLastMode] = useState<'run' | 'submit'>('run');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  /** Language the shown verdict was produced in (the user may switch since). */
  const [verdictLanguage, setVerdictLanguage] = useState(info.label);
  const consoleResize = useRowResize('fp:consoleHeight', 280);

  // JS questions: learn the suite's test names (registering tests doesn't run them).
  useEffect(() => {
    if (!assets.tests) return;
    runJob({ type: 'jest-collect', userCode: assets.starter, testCode: assets.tests, env: question.env }, 5000).then(
      (res) => {
        if (res.type === 'collected') setTestNames(res.names);
      },
    );
  }, [assets, question.env]);

  const execute = useCallback(
    async (mode: 'run' | 'submit') => {
      if (running || status !== 'ready') return;
      let start: () => Promise<RunResponse>;
      if (spec) {
        let runnable;
        try {
          runnable = mode === 'run' ? cases.map((c) => toRunnable(spec, c)) : spec.cases;
          setCaseError(undefined);
        } catch (e) {
          setCaseError((e as Error).message);
          setTab('testcase');
          return;
        }
        const input = { code: codeRef.current, spec, cases: runnable, refCode: assets.solution, checkerCode: assets.checker };
        start = () => runtime.run(input, info.limitMs);
      } else if (assets.tests) {
        const job = {
          type: 'jest' as const,
          userCode: codeRef.current,
          testCode: assets.tests,
          env: question.env,
          only: mode === 'run' && testNames.length ? exampleTests(testNames) : undefined,
        };
        start = () => runJob(job, JEST_LIMIT_MS);
      } else {
        return;
      }

      setRunning(mode);
      setLastMode(mode);
      setVerdictLanguage(info.label);
      setTab('result');
      const response = await start();
      const next = toVerdict(response);
      setVerdict(next);
      setRunning(null);

      if (mode === 'submit' && next.kind === 'accepted') {
        markSolved(question.slug);
        onAccepted();
      } else {
        markAttempted(question.slug);
      }
    },
    [running, status, spec, cases, assets, testNames, question.slug, question.env, onAccepted, runtime, info],
  );

  // ⌘' / Ctrl+' runs, ⌘↵ / Ctrl+↵ submits. Capture phase so the editor doesn't eat them.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === "'") {
        e.preventDefault();
        e.stopPropagation();
        execute('run');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        execute('submit');
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [execute]);

  const mod = modKey;
  const ariaMod = isMac ? 'Meta' : 'Control';
  const canRun = running === null && status === 'ready';

  // No confirm: reset straight away and offer Undo.
  const resetCode = () => {
    const { file, label } = info;
    const previous = sandpack.files[file]?.code ?? '';
    const starter = starters[file] ?? '';
    if (previous === starter) return;
    // Only this language's file: the others keep their code.
    sandpack.updateFile(file, starter);
    toast.show({
      message: `Reset ${label} code to the starter`,
      action: { label: 'Undo', done: `Restored your ${label} code`, run: () => sandpack.updateFile(file, previous) },
    });
  };

  return (
    <div className="code-workspace">
      <div className="editor-bar">
        <div className="editor-bar-start">
          {multiLanguage ? (
            <LanguageSelect value={language} onChange={onLanguageChange} disabled={running !== null} />
          ) : (
            <span className="editor-lang">JavaScript</span>
          )}
          <RuntimeStatus
            label={info.label}
            download={info.download}
            status={status}
            error={error}
            onRetry={() => runtime.warmUp().catch(() => {})}
          />
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={resetCode}
          data-tooltip={`Reset your ${info.label} code to the starter (you can undo)`}
        >
          <RotateCcw size={13} aria-hidden /> Reset code
        </button>
      </div>

      <div className="editor-area">
        {/* Remount once a lazily loaded grammar arrives so the editor picks it up. */}
        <SandpackCodeEditor
          key={editorLanguages.length}
          className="code-editor"
          showLineNumbers
          showTabs={false}
          wrapContent
          showInlineErrors={false}
          additionalLanguages={editorLanguages}
        />
      </div>

      <div
        className="row-resize"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize console"
        tabIndex={0}
        onPointerDown={consoleResize.onPointerDown}
        onKeyDown={consoleResize.onKeyDown}
      />

      <section className="console" style={{ height: consoleResize.height }} aria-label="Console">
        <div className="console-header">
          <div className="console-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'testcase'} onClick={() => setTab('testcase')}>
              Testcase
            </button>
            <button type="button" role="tab" aria-selected={tab === 'result'} onClick={() => setTab('result')}>
              Test Result
              {verdict && !running && <span className={`tab-dot verdict-${verdict.kind}`} aria-hidden />}
            </button>
          </div>
          <div className="console-actions">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => execute('run')}
              disabled={!canRun}
              data-tooltip="Run the visible testcases"
              data-tooltip-kbd={`${mod} '`}
              aria-keyshortcuts={`${ariaMod}+'`}
            >
              <Play size={13} aria-hidden /> Run <Kbd>{`${mod}'`}</Kbd>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-submit"
              onClick={() => execute('submit')}
              disabled={!canRun}
              data-tooltip="Judge against every testcase, including hidden ones"
              data-tooltip-kbd={`${mod} ↵`}
              aria-keyshortcuts={`${ariaMod}+Enter`}
            >
              <CloudUpload size={13} aria-hidden /> Submit <Kbd>{`${mod}↵`}</Kbd>
            </button>
          </div>
        </div>

        <div className="console-body">
          {tab === 'testcase' ? (
            spec ? (
              <DsaTestcasePanel
                spec={spec}
                cases={cases}
                selected={Math.min(selectedCase, cases.length - 1)}
                onSelect={setSelectedCase}
                onChange={setCases}
                onReset={() => {
                  setCases(initialCases);
                  setSelectedCase(0);
                  setCaseError(undefined);
                }}
                error={caseError}
              />
            ) : (
              <JsTestcasePanel runNames={exampleTests(testNames)} total={testNames.length} />
            )
          ) : (
            <ResultPanel
              mode={running ?? lastMode}
              verdict={verdict}
              running={running !== null}
              language={multiLanguage ? verdictLanguage : undefined}
            />
          )}
        </div>
      </section>

      <DraftSaver slug={question.slug} paths={Object.keys(starters)} />
    </div>
  );
}

/** LeetCode-style editor + Run/Submit console for JS and DSA questions (DSA: JavaScript or Python). */
export default function CodeWorkspace({ question, assets, onAccepted }: Props) {
  const { resolved } = useTheme();
  const multiLanguage = question.type === 'dsa' && Boolean(assets.spec);
  const [storedLanguage, setLanguage] = usePersistentState<LanguageId>('fp:dsaLanguage', 'javascript');
  const language: LanguageId = multiLanguage && isLanguageId(storedLanguage) ? storedLanguage : 'javascript';

  const starters = useMemo(() => starterFiles(assets, multiLanguage), [assets, multiLanguage]);
  // Stable references: Sandpack re-initialises its files whenever these props change identity,
  // which would wipe the editor on any parent re-render (e.g. after an Accepted submit).
  const files = useMemo(() => {
    const draft = loadDraft(question.slug);
    return Object.fromEntries(Object.entries(starters).map(([path, code]) => [path, draft?.files[path] ?? code]));
  }, [question.slug, starters]);
  // Only the initial open file; switching languages opens files from inside (see Inner).
  const [options] = useState(() => ({ activeFile: languageInfo(language).file, visibleFiles: [languageInfo(language).file] }));

  return (
    <SandpackProvider key={question.slug} files={files} theme={sandpackThemes[resolved]} options={options}>
      <Inner
        question={question}
        assets={assets}
        onAccepted={onAccepted}
        language={language}
        multiLanguage={multiLanguage}
        onLanguageChange={setLanguage}
        starters={starters}
      />
    </SandpackProvider>
  );
}

// Builds the source files of one Java run. Shared by the browser runtime
// (javaRuntime.ts → CheerpJ worker) and scripts/verify-java.test.js (real JDK),
// so both compile exactly the same thing. Plain JS: Node tests import it as-is.

/**
 * LeetCode's Java environment imports these for you. They go on the user's
 * first line, not above it, so javac's line numbers still match the editor.
 */
export const JAVA_IMPORTS =
  'import java.util.*; import java.util.function.*; import java.util.stream.*; import java.math.*; ';

/** Which node class (and which source variant of `Node`) each cases.json type needs. */
const NODE_FILE = {
  ListNode: ['ListNode', 'ListNode'],
  'ListNode[]': ['ListNode', 'ListNode'],
  ListNodeCycle: ['ListNode', 'ListNode'],
  TreeNode: ['TreeNode', 'TreeNode'],
  TreeNodeRef: ['TreeNode', 'TreeNode'],
  TreeNodeVal: ['TreeNode', 'TreeNode'],
  GraphNode: ['Node', 'GraphNode'],
  RandomListNode: ['Node', 'RandomNode'],
};

/** Comments dropped, so LeetCode's commented-out node definitions don't count as declarations. */
const withoutComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

const declares = (code, cls) => new RegExp(`\\b(class|interface|enum|record)\\s+${cls}\\b`).test(withoutComments(code));

/**
 * @param {string} code the user's Solution.java
 * @param {{ params?: { type: string }[], returns?: string }} spec cases.json
 * @param {Record<string, string>} nodeSources ListNode / TreeNode / GraphNode / RandomNode sources
 * @returns {Record<string, string>} file name → source, Solution.java first
 */
export function prepareJavaRun(code, spec, nodeSources) {
  const files = { 'Solution.java': JAVA_IMPORTS + code };
  const types = [...(spec.params ?? []).map((p) => p.type), spec.returns];
  for (const type of types) {
    const entry = NODE_FILE[type];
    if (!entry) continue;
    const [className, variant] = entry;
    // Users may paste LeetCode's definition uncommented; theirs wins.
    if (!declares(code, className)) files[`${className}.java`] = nodeSources[variant];
  }
  return files;
}

/** The job file FpHarness reads. */
export const jobJson = (spec, cases) => JSON.stringify({ spec, cases });

/** javac output with the sandbox's paths trimmed: `Solution.java:3: error: …`. */
export function cleanCompilerOutput(output) {
  return output.replace(/^\/?(?:[^\s:]*\/)?(\w+\.java):/gm, '$1:').trim();
}

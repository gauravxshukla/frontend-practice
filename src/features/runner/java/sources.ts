// Java sources compiled inside the browser, bundled as text. Imported lazily
// (only once someone picks Java), so they never weigh on the main chunk.
import fpConvert from './harness/FpConvert.java?raw';
import fpHarness from './harness/FpHarness.java?raw';
import fpJson from './harness/FpJson.java?raw';
import graphNode from './nodes/GraphNode.java?raw';
import listNode from './nodes/ListNode.java?raw';
import randomNode from './nodes/RandomNode.java?raw';
import treeNode from './nodes/TreeNode.java?raw';

/** The harness, compiled once per version and cached in CheerpJ's persistent /files. */
export const HARNESS_SOURCES: Record<string, string> = {
  'FpJson.java': fpJson,
  'FpConvert.java': fpConvert,
  'FpHarness.java': fpHarness,
};

/** Node classes compiled per run, only when the question uses them (see prepare.js). */
export const NODE_SOURCES: Record<string, string> = {
  ListNode: listNode,
  TreeNode: treeNode,
  GraphNode: graphNode,
  RandomNode: randomNode,
};

/** FNV-1a of the harness sources: a new harness gets a new cache directory. */
export function harnessHash(): string {
  let h = 0x811c9dc5;
  for (const text of Object.values(HARNESS_SOURCES)) {
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
  }
  return (h >>> 0).toString(16);
}

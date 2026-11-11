/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} root
 * @return {number[]}
 */
export default function rightSideView(root) {
  const result = [];
  if (!root) return result;
  let level = [root]; // every node on the current level, left to right
  while (level.length) {
    // the last node of a level is the one visible from the right
    result.push(level[level.length - 1].val);
    const next = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
  }
  return result;
}

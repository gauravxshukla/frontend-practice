/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} root
 * @return {number[][]}
 */
export default function levelOrder(root) {
  const result = [];
  if (!root) return result;
  let level = [root]; // every node on the current level
  while (level.length) {
    result.push(level.map((node) => node.val));
    // the next level is every child of this level, left to right
    const next = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
  }
  return result;
}

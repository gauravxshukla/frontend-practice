/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {TreeNode | null} root
 * @return {number}
 */
export default function goodNodes(root) {
  // Carry the largest value seen on the path from the root down.
  function dfs(node, maxSoFar) {
    if (!node) return 0;
    const good = node.val >= maxSoFar ? 1 : 0;
    const max = Math.max(maxSoFar, node.val);
    return good + dfs(node.left, max) + dfs(node.right, max);
  }

  return dfs(root, -Infinity);
}

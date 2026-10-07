/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {TreeNode} root
 * @return {number}
 */
export default function maxPathSum(root) {
  let best = -Infinity;

  // Returns the best sum of a downward path starting at `node` (one branch only),
  // while recording the best path that bends at `node` (both branches).
  function gain(node) {
    if (!node) return 0;
    const left = Math.max(0, gain(node.left)); // drop negative branches
    const right = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + left + right);
    return node.val + Math.max(left, right);
  }

  gain(root);
  return best;
}

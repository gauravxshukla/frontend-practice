/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode} root
 * @return {number}
 */
export default function maxPathSum(root) {
  let best = -Infinity; // all-negative trees still need their largest node
  // best sum of a path that starts at node and goes down one side
  const gain = (node) => {
    if (!node) return 0;
    // a negative branch only hurts, so take 0 (skip it) instead
    const left = Math.max(gain(node.left), 0);
    const right = Math.max(gain(node.right), 0);
    // the best path that bends at this node uses both sides
    best = Math.max(best, node.val + left + right);
    // a parent can extend through only one side
    return node.val + Math.max(left, right);
  };
  gain(root);
  return best;
}

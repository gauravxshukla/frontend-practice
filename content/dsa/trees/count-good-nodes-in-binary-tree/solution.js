/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} root
 * @return {number}
 */
export default function goodNodes(root) {
  // count good nodes below, given the largest value on the path from the root
  const count = (node, maxSoFar) => {
    if (!node) return 0;
    // nothing above is bigger (ties are allowed), so this node is good
    const good = node.val >= maxSoFar ? 1 : 0;
    const max = Math.max(maxSoFar, node.val);
    return good + count(node.left, max) + count(node.right, max);
  };
  return count(root, -Infinity);
}

/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {TreeNode | null} root
 * @return {number}
 */
export default function diameterOfBinaryTree(root) {
  let best = 0;

  // Returns the height (in nodes) of the subtree, and updates `best` with the
  // longest path that bends at this node: leftHeight + rightHeight edges.
  function height(node) {
    if (!node) return 0;
    const left = height(node.left);
    const right = height(node.right);
    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);
  }

  height(root);
  return best;
}

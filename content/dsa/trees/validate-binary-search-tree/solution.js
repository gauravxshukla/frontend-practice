/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {TreeNode | null} root
 * @return {boolean}
 */
export default function isValidBST(root) {
  // Every node must lie strictly inside the (low, high) window set by its ancestors.
  function valid(node, low, high) {
    if (!node) return true;
    if (node.val <= low || node.val >= high) return false;
    return valid(node.left, low, node.val) && valid(node.right, node.val, high);
  }

  return valid(root, -Infinity, Infinity);
}

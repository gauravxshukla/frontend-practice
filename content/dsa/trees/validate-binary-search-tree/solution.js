/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} root
 * @return {boolean}
 */
export default function isValidBST(root) {
  // every value in this subtree must lie strictly between low and high
  const valid = (node, low, high) => {
    if (!node) return true;
    if (node.val <= low || node.val >= high) return false;
    // going left caps values at this node; going right floors them here
    return valid(node.left, low, node.val) && valid(node.right, node.val, high);
  };
  return valid(root, -Infinity, Infinity);
}

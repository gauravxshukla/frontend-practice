/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} root
 * @return {boolean}
 */
export default function isBalanced(root) {
  // height of a subtree, or -1 as soon as any part of it is unbalanced
  const height = (node) => {
    if (!node) return 0;
    const left = height(node.left);
    const right = height(node.right);
    // pass a failure straight up instead of measuring further
    if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  };
  return height(root) !== -1;
}

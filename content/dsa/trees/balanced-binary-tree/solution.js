/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {TreeNode | null} root
 * @return {boolean}
 */
export default function isBalanced(root) {
  // Returns the subtree height, or -1 as soon as any subtree is unbalanced.
  function check(node) {
    if (!node) return 0;
    const left = check(node.left);
    if (left === -1) return -1;
    const right = check(node.right);
    if (right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  }

  return check(root) !== -1;
}

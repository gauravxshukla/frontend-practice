/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {TreeNode | null} root
 * @param {TreeNode | null} subRoot
 * @return {boolean}
 */
export default function isSubtree(root, subRoot) {
  if (!subRoot) return true;
  if (!root) return false;
  if (sameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function sameTree(a, b) {
  if (!a && !b) return true;
  if (!a || !b || a.val !== b.val) return false;
  return sameTree(a.left, b.left) && sameTree(a.right, b.right);
}

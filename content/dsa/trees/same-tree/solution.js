/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} p
 * @param {TreeNode | null} q
 * @return {boolean}
 */
export default function isSameTree(p, q) {
  // two empty subtrees match
  if (!p && !q) return true;
  // one empty, or different values, is a mismatch (checked before reading .val)
  if (!p || !q || p.val !== q.val) return false;
  // the roots match, so both subtree pairs must match too
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

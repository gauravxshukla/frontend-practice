/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} root
 * @return {TreeNode | null}
 */
export default function invertTree(root) {
  // an empty subtree is its own mirror
  if (!root) return null;
  // mirror each side first, then swap them
  const left = invertTree(root.left);
  root.left = invertTree(root.right);
  root.right = left;
  return root;
}

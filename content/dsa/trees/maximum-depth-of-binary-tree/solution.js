/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {TreeNode | null} root
 * @return {number}
 */
export default function maxDepth(root) {
  if (!root) return 0;
  // Depth of a node = 1 + the deeper of its two subtrees.
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

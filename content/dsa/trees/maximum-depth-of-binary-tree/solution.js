/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} root
 * @return {number}
 */
export default function maxDepth(root) {
  // an empty subtree adds no levels
  if (!root) return 0;
  // this node is one level above its deeper child
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

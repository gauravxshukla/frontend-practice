/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} root
 * @return {number} number of edges on the longest path
 */
export default function diameterOfBinaryTree(root) {
  let best = 0;
  // returns the height of a subtree, recording the widest path seen on the way
  const height = (node) => {
    if (!node) return 0;
    const left = height(node.left);
    const right = height(node.right);
    // the longest path bending at this node uses both heights (in edges)
    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);
  };
  height(root);
  return best;
}

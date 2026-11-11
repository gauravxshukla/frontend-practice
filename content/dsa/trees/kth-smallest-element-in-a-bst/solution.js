/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} root
 * @param {number} k 1-indexed
 * @return {number}
 */
export default function kthSmallest(root, k) {
  let remaining = k; // nodes still to visit before the answer
  let answer = null;
  // in-order (left, node, right) visits a BST's values smallest first
  const visit = (node) => {
    if (!node || answer !== null) return;
    visit(node.left);
    if (answer !== null) return; // found on the left: stop early
    remaining--;
    if (remaining === 0) {
      answer = node.val;
      return;
    }
    visit(node.right);
  };
  visit(root);
  return answer;
}

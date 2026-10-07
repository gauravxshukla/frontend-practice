/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
export default function kthSmallest(root, k) {
  // Iterative in-order traversal visits values in ascending order; stop at the k-th.
  const stack = [];
  let node = root;
  while (node || stack.length) {
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop();
    k -= 1;
    if (k === 0) return node.val;
    node = node.right;
  }
  return -1;
}

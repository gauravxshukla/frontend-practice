/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
export default function lowestCommonAncestor(root, p, q) {
  let node = root;
  while (node) {
    // Both targets smaller: the split point is further left.
    if (p.val < node.val && q.val < node.val) node = node.left;
    // Both larger: go right.
    else if (p.val > node.val && q.val > node.val) node = node.right;
    // They split here (or one of them is this node).
    else return node;
  }
  return null;
}

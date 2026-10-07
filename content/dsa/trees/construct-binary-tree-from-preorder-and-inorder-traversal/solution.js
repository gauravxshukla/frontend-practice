/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode | null}
 */
export default function buildTree(preorder, inorder) {
  // Value → index in inorder, so each root split is O(1).
  const indexOf = new Map(inorder.map((val, i) => [val, i]));
  let pre = 0; // next root to take from preorder

  function build(lo, hi) {
    if (lo > hi) return null;
    const val = preorder[pre++];
    const mid = indexOf.get(val);
    // Preorder is root, left subtree, right subtree, so build left first.
    const left = build(lo, mid - 1);
    const right = build(mid + 1, hi);
    return { val, left, right };
  }

  return build(0, inorder.length - 1);
}

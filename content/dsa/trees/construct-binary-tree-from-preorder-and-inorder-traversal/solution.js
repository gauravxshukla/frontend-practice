/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode | null}
 */
export default function buildTree(preorder, inorder) {
  // value -> position in inorder, so each split is found in O(1)
  const indexOf = new Map(inorder.map((value, i) => [value, i]));
  let next = 0; // the next preorder value is always the next root to place
  // builds the subtree whose values occupy inorder[lo..hi]
  const build = (lo, hi) => {
    if (lo > hi) return null;
    const value = preorder[next++];
    const mid = indexOf.get(value);
    // preorder lists the whole left subtree before the right, so build left first
    const left = build(lo, mid - 1);
    const right = build(mid + 1, hi);
    return { val: value, left, right };
  };
  return build(0, inorder.length - 1);
}

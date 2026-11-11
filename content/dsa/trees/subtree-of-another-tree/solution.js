/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

// two trees match when values and shape match all the way down
const isSame = (a, b) => {
  if (!a && !b) return true;
  if (!a || !b || a.val !== b.val) return false;
  return isSame(a.left, b.left) && isSame(a.right, b.right);
};

/**
 * @param {TreeNode | null} root
 * @param {TreeNode | null} subRoot
 * @return {boolean}
 */
export default function isSubtree(root, subRoot) {
  // an empty tree is a subtree of anything
  if (!subRoot) return true;
  // ran out of places to start a match
  if (!root) return false;
  // try a match starting here, otherwise look further down either side
  return isSame(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

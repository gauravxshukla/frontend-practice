/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 * @param {TreeNode | null} root
 * @return {number[]}
 */
export default function rightSideView(root) {
  const view = [];
  let level = root ? [root] : [];
  while (level.length) {
    // The last node of each level is the one visible from the right.
    view.push(level[level.length - 1].val);
    const next = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
  }
  return view;
}

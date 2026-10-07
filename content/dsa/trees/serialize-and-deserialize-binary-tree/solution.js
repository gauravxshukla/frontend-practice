/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * Preorder walk, writing "#" for each missing child.
 * @param {TreeNode | null} root
 * @return {string}
 */
function serialize(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node) {
      out.push('#');
      continue;
    }
    out.push(String(node.val));
    stack.push(node.right, node.left); // left is popped first
  }
  return out.join(',');
}

/**
 * Rebuilds the tree by reading the same preorder sequence back.
 * @param {string} data
 * @return {TreeNode | null}
 */
function deserialize(data) {
  const tokens = data.split(',');
  let i = 0;

  function build() {
    const token = tokens[i++];
    if (token === '#' || token === undefined) return null;
    const node = { val: Number(token), left: null, right: null };
    node.left = build();
    node.right = build();
    return node;
  }

  return build();
}

export default { serialize, deserialize };

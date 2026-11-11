/**
 * @typedef {{ val: number, left: TreeNode | null, right: TreeNode | null }} TreeNode
 */

/**
 * @param {TreeNode | null} root
 * @return {string}
 */
function serialize(root) {
  const out = [];
  // preorder: node, then left, then right; "#" marks a missing child
  const write = (node) => {
    if (!node) {
      out.push('#');
      return;
    }
    out.push(String(node.val));
    write(node.left);
    write(node.right);
  };
  write(root);
  return out.join(',');
}

/**
 * @param {string} data
 * @return {TreeNode | null}
 */
function deserialize(data) {
  const tokens = data.split(',');
  let i = 0;
  // read tokens back in the same preorder they were written
  const read = () => {
    const token = tokens[i++];
    if (token === '#') return null;
    const node = { val: Number(token), left: null, right: null };
    node.left = read();
    node.right = read();
    return node;
  };
  return read();
}

export default { serialize, deserialize };

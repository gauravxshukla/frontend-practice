/**
 * @typedef {string | { tag: string, children?: Node[] }} Node
 * @param {Node} tree
 * @param {string} [indent]
 * @return {string}
 */
export default function serializeHTML(tree, indent = '  ') {
  function lines(node, depth) {
    const pad = indent.repeat(depth);
    if (typeof node === 'string') return [pad + node];
    return [
      `${pad}<${node.tag}>`,
      ...(node.children ?? []).flatMap((child) => lines(child, depth + 1)),
      `${pad}</${node.tag}>`,
    ];
  }

  return lines(tree, 0).join('\n');
}

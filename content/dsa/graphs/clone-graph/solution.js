/**
 * @typedef {{ val: number, neighbors: GraphNode[] }} GraphNode
 * @param {GraphNode | null} node
 * @return {GraphNode | null}
 */
export default function cloneGraph(node) {
  const copies = new Map(); // original node -> its clone
  const clone = (original) => {
    // already cloned (we came back around a cycle): reuse it
    if (copies.has(original)) return copies.get(original);
    const copy = { val: original.val, neighbors: [] };
    // register before visiting neighbours so cycles find this clone
    copies.set(original, copy);
    for (const nb of original.neighbors) copy.neighbors.push(clone(nb));
    return copy;
  };
  return node ? clone(node) : null;
}

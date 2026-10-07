/**
 * @typedef {{ val: number, neighbors: GraphNode[] }} GraphNode
 * @param {GraphNode | null} node
 * @return {GraphNode | null}
 */
export default function cloneGraph(node) {
  if (!node) return null;
  const copies = new Map(); // original node -> its clone

  copies.set(node, { val: node.val, neighbors: [] });
  const queue = [node];
  while (queue.length) {
    const current = queue.shift();
    for (const neighbor of current.neighbors) {
      if (!copies.has(neighbor)) {
        // First time we see it: create the clone and schedule its edges.
        copies.set(neighbor, { val: neighbor.val, neighbors: [] });
        queue.push(neighbor);
      }
      copies.get(current).neighbors.push(copies.get(neighbor));
    }
  }
  return copies.get(node);
}

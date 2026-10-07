/**
 * @param {number[][]} edges  undirected edges on nodes 1..n (a tree plus one extra edge)
 * @return {number[]} the edge to remove (the last such edge in the input)
 */
export default function findRedundantConnection(edges) {
  const parent = Array.from({ length: edges.length + 1 }, (_, i) => i);
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };

  // The first edge whose endpoints are already connected closes the only cycle.
  // Every other cycle edge appears earlier, so it is also the last removable edge.
  for (const [a, b] of edges) {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return [a, b];
    parent[ra] = rb;
  }
  return [];
}

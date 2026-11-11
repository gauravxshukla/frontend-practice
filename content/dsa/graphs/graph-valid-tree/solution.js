/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */
export default function validTree(n, edges) {
  // a tree on n nodes has exactly n - 1 edges; with that count, no cycle means connected
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, (_, i) => i);
  // root of x's set, pointing nodes closer to the root as we go (path halving)
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  for (const [a, b] of edges) {
    const ra = find(a);
    const rb = find(b);
    // already connected: this edge closes a cycle
    if (ra === rb) return false;
    parent[ra] = rb;
  }
  return true;
}

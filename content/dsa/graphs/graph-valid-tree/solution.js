/**
 * @param {number} n  nodes are labelled 0..n-1
 * @param {number[][]} edges  undirected edges
 * @return {boolean}
 */
export default function validTree(n, edges) {
  // A tree on n nodes has exactly n - 1 edges and no cycle (which then forces connectivity).
  if (edges.length !== n - 1) return false;

  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // path halving
      x = parent[x];
    }
    return x;
  };

  for (const [a, b] of edges) {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false; // edge closes a cycle
    parent[ra] = rb;
  }
  return true;
}

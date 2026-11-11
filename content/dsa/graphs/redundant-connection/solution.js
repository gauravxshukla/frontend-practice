/**
 * @param {number[][]} edges nodes labelled 1..n
 * @return {number[]}
 */
export default function findRedundantConnection(edges) {
  // nodes are 1-indexed, so slot 0 goes unused
  const parent = Array.from({ length: edges.length + 1 }, (_, i) => i);
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
    // already connected without this edge: it's the one that makes the cycle
    if (ra === rb) return [a, b];
    parent[ra] = rb;
  }
  return []; // unreachable: the input always has one extra edge
}

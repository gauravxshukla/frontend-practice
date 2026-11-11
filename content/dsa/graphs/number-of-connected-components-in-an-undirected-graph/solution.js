/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number}
 */
export default function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  // root of x's set, pointing nodes closer to the root as we go (path halving)
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  let components = n; // every node starts on its own
  for (const [a, b] of edges) {
    const ra = find(a);
    const rb = find(b);
    // joining two different groups leaves one fewer; same group changes nothing
    if (ra !== rb) {
      parent[ra] = rb;
      components--;
    }
  }
  return components;
}

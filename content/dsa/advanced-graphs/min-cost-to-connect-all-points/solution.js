/**
 * @param {number[][]} points  [x, y] pairs; edge cost is the Manhattan distance
 * @return {number} total cost of a minimum spanning tree
 */
export default function minCostConnectPoints(points) {
  const n = points.length;
  // Dense-graph Prim: O(n^2) with no heap, ideal when every pair is an edge.
  const best = new Array(n).fill(Infinity); // cheapest edge from the tree to each point
  const inTree = new Array(n).fill(false);
  best[0] = 0;
  let total = 0;

  for (let added = 0; added < n; added++) {
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!inTree[i] && (u === -1 || best[i] < best[u])) u = i;
    }
    inTree[u] = true;
    total += best[u];
    for (let v = 0; v < n; v++) {
      if (inTree[v]) continue;
      const cost = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
      if (cost < best[v]) best[v] = cost;
    }
  }
  return total;
}

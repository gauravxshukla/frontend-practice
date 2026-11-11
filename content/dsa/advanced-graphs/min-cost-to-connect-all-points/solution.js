/**
 * @param {number[][]} points
 * @return {number}
 */
export default function minCostConnectPoints(points) {
  const n = points.length;
  const inTree = new Array(n).fill(false);
  // cheapest known edge from the growing tree to each outside point
  const best = new Array(n).fill(Infinity);
  best[0] = 0; // start the tree at point 0
  let total = 0;
  for (let added = 0; added < n; added++) {
    // the closest outside point joins next (Prim's greedy step)
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!inTree[i] && (u === -1 || best[i] < best[u])) u = i;
    }
    inTree[u] = true;
    total += best[u];
    // the new tree point may offer a cheaper link to the remaining points
    for (let v = 0; v < n; v++) {
      if (inTree[v]) continue;
      const cost = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
      if (cost < best[v]) best[v] = cost;
    }
  }
  return total;
}

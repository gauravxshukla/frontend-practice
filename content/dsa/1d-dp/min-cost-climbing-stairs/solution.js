/**
 * @param {number[]} cost
 * @return {number}
 */
export default function minCostClimbingStairs(cost) {
  // best(i) = cheapest way to stand on step i (before paying cost[i]).
  // best(i) = min(best(i - 1) + cost[i - 1], best(i - 2) + cost[i - 2]), best(0) = best(1) = 0.
  let twoBack = 0;
  let oneBack = 0;
  for (let i = 2; i <= cost.length; i++) {
    const current = Math.min(oneBack + cost[i - 1], twoBack + cost[i - 2]);
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}

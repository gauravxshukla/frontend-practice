/**
 * @param {number[]} cost
 * @return {number}
 */
export default function minCostClimbingStairs(cost) {
  // cheapest cost to stand on step i - 2 and step i - 1; starting on 0 or 1 is free
  let twoBack = 0;
  let oneBack = 0;
  // the top is step cost.length, just past the last stair
  for (let i = 2; i <= cost.length; i++) {
    // arrive from one below (paying its cost) or two below (paying that one)
    const here = Math.min(oneBack + cost[i - 1], twoBack + cost[i - 2]);
    twoBack = oneBack;
    oneBack = here;
  }
  return oneBack;
}

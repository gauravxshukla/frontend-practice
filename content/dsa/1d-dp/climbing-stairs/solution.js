/**
 * @param {number} n
 * @return {number}
 */
export default function climbStairs(n) {
  // ways(i) = ways(i - 1) + ways(i - 2): only the last two values are needed.
  let oneBack = 1; // ways to reach step 1
  let twoBack = 1; // ways to reach step 0 (stand still)
  for (let i = 2; i <= n; i++) {
    const current = oneBack + twoBack;
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}

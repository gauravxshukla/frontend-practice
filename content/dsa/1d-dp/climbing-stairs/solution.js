/**
 * @param {number} n
 * @return {number}
 */
export default function climbStairs(n) {
  // ways to stand on the step two below and one below the current one
  let twoBack = 1; // step 0: one way (do nothing)
  let oneBack = 1; // step 1: one way
  for (let i = 2; i <= n; i++) {
    // the last move was either a 1-step or a 2-step
    const ways = oneBack + twoBack;
    twoBack = oneBack;
    oneBack = ways;
  }
  return oneBack;
}

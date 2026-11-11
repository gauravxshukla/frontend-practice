/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
export default function coinChange(coins, amount) {
  // dp[a] = fewest coins that make amount a (Infinity = impossible so far)
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // zero coins make zero
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      // using coin c last leaves a - c, whose best answer is already known
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

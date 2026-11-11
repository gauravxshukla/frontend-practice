/**
 * @param {number[]} nums
 * @return {number}
 */
export default function maxCoins(nums) {
  // virtual balloons worth 1 on both ends act as the outer neighbours
  const vals = [1, ...nums, 1];
  const n = vals.length;
  // dp[l][r] = best coins from bursting every balloon strictly between l and r
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  // solve shorter intervals first, since longer ones are built from them
  for (let width = 2; width < n; width++) {
    for (let l = 0; l + width < n; l++) {
      const r = l + width;
      // k is the last balloon burst between l and r, so its neighbours are l and r
      for (let k = l + 1; k < r; k++) {
        dp[l][r] = Math.max(dp[l][r], dp[l][k] + vals[l] * vals[k] * vals[r] + dp[k][r]);
      }
    }
  }
  return dp[0][n - 1];
}

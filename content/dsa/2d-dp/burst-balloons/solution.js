/**
 * @param {number[]} nums
 * @return {number}
 */
export default function maxCoins(nums) {
  // Pad with virtual 1s, then best[l][r] = max coins from bursting every balloon strictly between l and r.
  // Choose k as the LAST balloon burst in (l, r): its neighbours at that moment are exactly l and r.
  // best[l][r] = max over l < k < r of best[l][k] + vals[l] * vals[k] * vals[r] + best[k][r]
  const vals = [1, ...nums, 1];
  const n = vals.length;
  const best = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let gap = 2; gap < n; gap++) {
    for (let l = 0; l + gap < n; l++) {
      const r = l + gap;
      for (let k = l + 1; k < r; k++) {
        const coins = best[l][k] + vals[l] * vals[k] * vals[r] + best[k][r];
        if (coins > best[l][r]) best[l][r] = coins;
      }
    }
  }
  return best[0][n - 1];
}

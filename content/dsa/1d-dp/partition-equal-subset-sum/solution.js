/**
 * @param {number[]} nums
 * @return {boolean}
 */
export default function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  // reachable[s] = some subset of the numbers seen so far sums to s (0/1 knapsack, one row).
  const reachable = new Array(target + 1).fill(false);
  reachable[0] = true;
  for (const n of nums) {
    // Go downwards so each number is used at most once.
    for (let s = target; s >= n; s--) {
      if (reachable[s - n]) reachable[s] = true;
    }
    if (reachable[target]) return true;
  }
  return reachable[target];
}

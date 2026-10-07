/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
export default function findTargetSumWays(nums, target) {
  // Let P be the numbers given '+'. sum(P) - (total - sum(P)) = target, so sum(P) = (total + target) / 2.
  const total = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > total || (total + target) % 2 !== 0) return 0;
  const goal = (total + target) / 2;
  // count[s] = number of index subsets with sum s (0/1 knapsack, one row, downward sweep).
  const count = new Array(goal + 1).fill(0);
  count[0] = 1;
  for (const n of nums) {
    for (let s = goal; s >= n; s--) count[s] += count[s - n];
  }
  return count[goal];
}

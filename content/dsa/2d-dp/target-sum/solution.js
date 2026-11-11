/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
export default function findTargetSumWays(nums, target) {
  const total = nums.reduce((a, b) => a + b, 0);
  // the + group must sum to (total + target) / 2, which has to be a whole, reachable number
  if (Math.abs(target) > total || (total + target) % 2 !== 0) return 0;
  const goal = (total + target) / 2;
  // ways[s] = subsets of the numbers so far that sum to s
  const ways = new Array(goal + 1).fill(0);
  ways[0] = 1;
  for (const num of nums) {
    // downward so each number joins a subset at most once (a 0 doubles the count: +0 and -0)
    for (let s = goal; s >= num; s--) ways[s] += ways[s - num];
  }
  return ways[goal];
}

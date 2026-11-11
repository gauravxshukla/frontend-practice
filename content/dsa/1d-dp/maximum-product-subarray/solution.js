/**
 * @param {number[]} nums
 * @return {number}
 */
export default function maxProduct(nums) {
  // largest and smallest products of a subarray ending at the current index
  let curMax = nums[0];
  let curMin = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    // start fresh at n, or extend either extreme (a negative n swaps them)
    const a = n * curMax;
    const b = n * curMin;
    curMax = Math.max(n, a, b);
    curMin = Math.min(n, a, b);
    best = Math.max(best, curMax);
  }
  return best;
}

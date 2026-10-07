/**
 * Kadane's algorithm.
 * @param {number[]} nums
 * @return {number}
 */
export default function maxSubArray(nums) {
  let best = nums[0];
  let current = 0;

  for (const n of nums) {
    // A negative running sum only drags the next element down, so restart.
    current = Math.max(n, current + n);
    best = Math.max(best, current);
  }
  return best;
}

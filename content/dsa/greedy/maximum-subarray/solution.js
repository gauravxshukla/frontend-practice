/**
 * @param {number[]} nums
 * @return {number}
 */
export default function maxSubArray(nums) {
  let current = nums[0]; // best sum of a subarray ending at the current index
  let best = nums[0]; // all-negative input still needs a real element
  for (let i = 1; i < nums.length; i++) {
    // a negative running sum can only hurt, so restart at nums[i] instead
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}

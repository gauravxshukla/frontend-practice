/**
 * @param {number[]} nums
 * @return {number}
 */
export default function missingNumber(nums) {
  let result = nums.length; // include n itself
  for (let i = 0; i < nums.length; i++) {
    // Each present value cancels its matching index.
    result ^= i ^ nums[i];
  }
  return result;
}

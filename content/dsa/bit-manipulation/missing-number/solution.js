/**
 * @param {number[]} nums n distinct values from 0..n
 * @return {number}
 */
export default function missingNumber(nums) {
  // indices only reach n - 1, so start with n itself
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) {
    // each present value cancels with the matching index, leaving the missing one
    result ^= i ^ nums[i];
  }
  return result;
}

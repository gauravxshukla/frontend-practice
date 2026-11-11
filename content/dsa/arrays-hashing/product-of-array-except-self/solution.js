/**
 * @param {number[]} nums
 * @return {number[]}
 */
export default function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n);
  // pass 1: answer[i] = product of everything to the left of i
  let left = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = left;
    left *= nums[i];
  }
  // pass 2: multiply in the product of everything to the right of i
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= right;
    right *= nums[i];
  }
  // the output array is the only extra memory, and no division handles zeros
  return answer;
}

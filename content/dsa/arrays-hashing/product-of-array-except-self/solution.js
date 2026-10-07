/**
 * @param {number[]} nums
 * @return {number[]}
 */
export default function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n);

  // Pass 1: result[i] = product of everything to the left of i.
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  // Pass 2: multiply in the product of everything to the right of i.
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}

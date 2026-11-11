/**
 * @param {number[]} nums
 * @return {number}
 */
export default function singleNumber(nums) {
  let result = 0;
  // pairs cancel out (a ^ a = 0), leaving the value that appears once
  for (const n of nums) result ^= n;
  return result;
}

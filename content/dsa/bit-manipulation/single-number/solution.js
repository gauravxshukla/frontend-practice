/**
 * @param {number[]} nums
 * @return {number}
 */
export default function singleNumber(nums) {
  let result = 0;
  // Pairs cancel out (a ^ a = 0), so only the single value survives.
  for (const n of nums) result ^= n;
  return result;
}

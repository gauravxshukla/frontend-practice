/**
 * @param {number[]} nums
 * @return {number}
 */
export default function maxProduct(nums) {
  let best = nums[0];
  let maxEndingHere = nums[0];
  let minEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    const candidates = [n, n * maxEndingHere, n * minEndingHere];
    maxEndingHere = Math.max(...candidates);
    minEndingHere = Math.min(...candidates);
    best = Math.max(best, maxEndingHere);
  }

  return best;
}

/**
 * @param {number[]} nums sorted ascending, distinct values
 * @param {number} target
 * @return {number} index of target, or -1
 */
export default function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  // Invariant: if target exists, it is inside [lo, hi].
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

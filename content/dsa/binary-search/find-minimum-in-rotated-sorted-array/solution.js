/**
 * @param {number[]} nums rotated sorted array of distinct values
 * @return {number}
 */
export default function findMin(nums) {
  let l = 0;
  let r = nums.length - 1;
  while (l < r) {
    const mid = l + Math.floor((r - l) / 2);
    // mid is bigger than the right end, so the drop to the minimum is after mid
    if (nums[mid] > nums[r]) l = mid + 1;
    // mid..r is sorted, so the minimum is mid or to its left
    else r = mid;
  }
  // l and r meet on the minimum
  return nums[l];
}

/**
 * @param {number[]} nums rotated sorted array of distinct values
 * @param {number} target
 * @return {number}
 */
export default function search(nums, target) {
  let l = 0;
  let r = nums.length - 1;
  while (l <= r) {
    const mid = l + Math.floor((r - l) / 2);
    if (nums[mid] === target) return mid;
    if (nums[l] <= nums[mid]) {
      // left half is sorted: the target is there only if it's inside its range
      if (nums[l] <= target && target < nums[mid]) r = mid - 1;
      else l = mid + 1;
    } else {
      // right half is sorted: same test on its range
      if (nums[mid] < target && target <= nums[r]) l = mid + 1;
      else r = mid - 1;
    }
  }
  return -1;
}

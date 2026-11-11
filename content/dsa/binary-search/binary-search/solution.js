/**
 * @param {number[]} nums sorted ascending
 * @param {number} target
 * @return {number} index of target, or -1
 */
export default function search(nums, target) {
  let l = 0;
  let r = nums.length - 1;
  // l <= r: a one-element range can still hold the target
  while (l <= r) {
    const mid = l + Math.floor((r - l) / 2);
    if (nums[mid] === target) return mid;
    // the target can only be on the side sorted order points to
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}

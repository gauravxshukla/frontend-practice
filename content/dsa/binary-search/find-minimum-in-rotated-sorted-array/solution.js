/**
 * @param {number[]} nums a rotated ascending array of distinct values
 * @return {number} the smallest value
 */
export default function findMin(nums) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    // If mid is bigger than the right end, the drop (and the minimum) is to the right of mid.
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid; // mid itself might be the minimum
  }
  return nums[lo];
}

/**
 * @param {number[]} nums1 sorted ascending
 * @param {number[]} nums2 sorted ascending
 * @return {number} the median of all values from both arrays
 */
export default function findMedianSortedArrays(nums1, nums2) {
  // Binary search the partition of the shorter array.
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);

  const m = nums1.length;
  const n = nums2.length;
  const half = Math.floor((m + n + 1) / 2); // size of the combined left half

  let lo = 0;
  let hi = m;
  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2); // elements taken from nums1
    const j = half - i; // elements taken from nums2

    const left1 = i > 0 ? nums1[i - 1] : -Infinity;
    const right1 = i < m ? nums1[i] : Infinity;
    const left2 = j > 0 ? nums2[j - 1] : -Infinity;
    const right2 = j < n ? nums2[j] : Infinity;

    if (left1 <= right2 && left2 <= right1) {
      // Valid partition: everything on the left is <= everything on the right.
      const leftMax = Math.max(left1, left2);
      if ((m + n) % 2 === 1) return leftMax;
      return (leftMax + Math.min(right1, right2)) / 2;
    }
    if (left1 > right2) hi = i - 1; // took too many from nums1
    else lo = i + 1; // took too few from nums1
  }
  throw new Error('inputs are not sorted');
}

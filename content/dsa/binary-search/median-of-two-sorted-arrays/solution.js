/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
export default function findMedianSortedArrays(nums1, nums2) {
  // binary search the shorter array so the other side's index stays valid
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length;
  const n = nums2.length;
  const half = Math.floor((m + n + 1) / 2); // size of the left part (gets the extra item when odd)
  let l = 0;
  let r = m;
  while (l <= r) {
    const i = Math.floor((l + r) / 2); // items taken from nums1 into the left part
    const j = half - i; // the rest of the left part comes from nums2
    // values beside the cut; missing sides act as -Infinity / +Infinity
    const left1 = i > 0 ? nums1[i - 1] : -Infinity;
    const right1 = i < m ? nums1[i] : Infinity;
    const left2 = j > 0 ? nums2[j - 1] : -Infinity;
    const right2 = j < n ? nums2[j] : Infinity;
    if (left1 <= right2 && left2 <= right1) {
      // every left value is <= every right value: the cut is the median position
      if ((m + n) % 2 === 1) return Math.max(left1, left2);
      return (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
    }
    // nums1 gave too much to the left, so take fewer from it
    if (left1 > right2) r = i - 1;
    // nums1 gave too little, so take more
    else l = i + 1;
  }
  return 0; // unreachable for sorted input
}

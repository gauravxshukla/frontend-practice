/**
 * @param {number[]} nums
 * @return {number[][]}
 */
export default function threeSum(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length - 2; i++) {
    if (sorted[i] > 0) break; // smallest value positive: no zero sum possible
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // skip duplicate anchors

    let left = i + 1;
    let right = sorted.length - 1;
    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];
      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        result.push([sorted[i], sorted[left], sorted[right]]);
        left++;
        right--;
        // Skip duplicates of the middle value so each triplet appears once.
        while (left < right && sorted[left] === sorted[left - 1]) left++;
      }
    }
  }
  return result;
}

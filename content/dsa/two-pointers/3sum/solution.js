/**
 * @param {number[]} nums
 * @return {number[][]}
 */
export default function threeSum(nums) {
  // sorting lets pointers steer the sum and puts duplicates side by side
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    // the same first value would only repeat triplets already found
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    // a positive smallest value can't reach a sum of 0
    if (sorted[i] > 0) break;
    let l = i + 1;
    let r = sorted.length - 1;
    while (l < r) {
      const sum = sorted[i] + sorted[l] + sorted[r];
      if (sum < 0) l++; // need a bigger total
      else if (sum > 0) r--; // need a smaller total
      else {
        result.push([sorted[i], sorted[l], sorted[r]]);
        l++;
        r--;
        // step past equal values so this triplet isn't added again
        while (l < r && sorted[l] === sorted[l - 1]) l++;
        while (l < r && sorted[r] === sorted[r + 1]) r--;
      }
    }
  }
  return result;
}

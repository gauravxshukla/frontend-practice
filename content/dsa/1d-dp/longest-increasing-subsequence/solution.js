/**
 * @param {number[]} nums
 * @return {number}
 */
export default function lengthOfLIS(nums) {
  // tails[k] = smallest possible tail of a strictly increasing subsequence of length k + 1.
  const tails = [];
  for (const x of nums) {
    // Binary search for the first tail ≥ x and replace it (or append).
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}

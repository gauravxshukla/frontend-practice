/**
 * @param {number[]} nums
 * @return {number}
 */
export default function lengthOfLIS(nums) {
  // tails[k] = smallest tail value of any increasing subsequence of length k + 1 (kept sorted)
  const tails = [];
  for (const num of nums) {
    // find the first tail >= num (>= keeps the subsequence strictly increasing)
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    // a smaller tail for that length leaves more room to extend later; past the end, it's a new length
    tails[lo] = num;
  }
  return tails.length;
}

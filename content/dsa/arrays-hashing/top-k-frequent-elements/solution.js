/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
export default function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  // Bucket sort: buckets[c] holds every value that appears exactly c times.
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, count] of freq) buckets[count].push(value);

  const result = [];
  for (let c = buckets.length - 1; c > 0 && result.length < k; c--) {
    for (const value of buckets[c]) {
      result.push(value);
      if (result.length === k) break;
    }
  }
  return result;
}

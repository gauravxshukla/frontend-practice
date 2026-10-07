/**
 * @param {number[]} nums
 * @return {number}
 */
export default function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;

  for (const n of set) {
    // Only start counting from the first number of a run.
    if (set.has(n - 1)) continue;

    let length = 1;
    while (set.has(n + length)) length++;
    best = Math.max(best, length);
  }
  return best;
}

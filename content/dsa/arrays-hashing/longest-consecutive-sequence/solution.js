/**
 * @param {number[]} nums
 * @return {number}
 */
export default function longestConsecutive(nums) {
  const values = new Set(nums); // O(1) lookups, and duplicates collapse
  let best = 0;
  for (const num of values) {
    // only a run's first value starts a walk, so each value is walked once
    if (values.has(num - 1)) continue;
    let length = 1;
    // extend the run while the next value exists
    while (values.has(num + length)) length++;
    best = Math.max(best, length);
  }
  // empty input never enters the loop, so the answer is 0
  return best;
}

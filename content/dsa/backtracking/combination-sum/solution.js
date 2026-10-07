/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
export default function combinationSum(candidates, target) {
  const sorted = [...candidates].sort((a, b) => a - b);
  const result = [];
  const path = [];

  // Only pick candidates at index >= start, so each combination is built in
  // non-decreasing order and never repeats in a different order.
  function backtrack(start, remaining) {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i] > remaining) break; // sorted, so nothing later fits either
      path.push(sorted[i]);
      backtrack(i, remaining - sorted[i]); // i, not i + 1: reuse allowed
      path.pop();
    }
  }

  backtrack(0, target);
  return result;
}

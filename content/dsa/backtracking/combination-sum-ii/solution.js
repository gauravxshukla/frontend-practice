/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
export default function combinationSum2(candidates, target) {
  const sorted = [...candidates].sort((a, b) => a - b);
  const result = [];
  const path = [];

  function backtrack(start, remaining) {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      // At one depth, use each distinct value only once: this removes duplicate combinations.
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      if (sorted[i] > remaining) break;
      path.push(sorted[i]);
      backtrack(i + 1, remaining - sorted[i]); // each element used at most once
      path.pop();
    }
  }

  backtrack(0, target);
  return result;
}

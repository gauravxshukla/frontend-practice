/**
 * @param {number[]} nums
 * @return {number[][]}
 */
export default function subsetsWithDup(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  const path = [];

  // Every node of the recursion tree is a distinct subset.
  function backtrack(start) {
    result.push([...path]);
    for (let i = start; i < sorted.length; i++) {
      // Skip a value equal to the previous one at the same depth.
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      path.push(sorted[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}

/**
 * @param {number[]} candidates may contain duplicates
 * @param {number} target
 * @return {number[][]}
 */
export default function combinationSum2(candidates, target) {
  // sorting puts equal values side by side and lets us stop early
  const sorted = [...candidates].sort((a, b) => a - b);
  const result = [];
  const path = [];
  const dfs = (start, remaining) => {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      // the same value at the same depth would rebuild combinations already found
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      // sorted, so every later value overshoots too
      if (sorted[i] > remaining) break;
      path.push(sorted[i]);
      dfs(i + 1, remaining - sorted[i]); // i + 1: each element is used at most once
      path.pop();
    }
  };
  dfs(0, target);
  return result;
}

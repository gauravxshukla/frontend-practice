/**
 * @param {number[]} candidates distinct positive values
 * @param {number} target
 * @return {number[][]}
 */
export default function combinationSum(candidates, target) {
  const result = [];
  const path = [];
  const dfs = (start, remaining) => {
    // the path adds up exactly to the target
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    // only candidates from start onwards, so each combination is built in one order
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) continue; // would overshoot
      path.push(candidates[i]);
      dfs(i, remaining - candidates[i]); // stay at i: the same number may repeat
      path.pop();
    }
  };
  dfs(0, target);
  return result;
}

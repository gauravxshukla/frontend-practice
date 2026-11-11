/**
 * @param {number[]} nums distinct values
 * @return {number[][]}
 */
export default function subsets(nums) {
  const result = [];
  const path = []; // the subset being built
  const dfs = (i) => {
    // every element has been decided: record this subset (as a copy)
    if (i === nums.length) {
      result.push([...path]);
      return;
    }
    // choice 1: include nums[i]
    path.push(nums[i]);
    dfs(i + 1);
    path.pop(); // undo before the other choice
    // choice 2: skip nums[i]
    dfs(i + 1);
  };
  dfs(0);
  return result;
}

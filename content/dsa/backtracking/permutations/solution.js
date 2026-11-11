/**
 * @param {number[]} nums distinct values
 * @return {number[][]}
 */
export default function permute(nums) {
  const result = [];
  const path = [];
  const used = new Array(nums.length).fill(false); // which numbers are on the current path
  const dfs = () => {
    // every position is filled
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      // place nums[i] next, explore, then free it for other branches
      used[i] = true;
      path.push(nums[i]);
      dfs();
      path.pop();
      used[i] = false;
    }
  };
  dfs();
  return result;
}

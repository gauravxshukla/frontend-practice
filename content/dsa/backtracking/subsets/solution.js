/**
 * @param {number[]} nums
 * @return {number[][]}
 */
export default function subsets(nums) {
  const result = [];
  const path = [];

  // At each index, branch on "skip nums[i]" vs "take nums[i]".
  function backtrack(i) {
    if (i === nums.length) {
      result.push([...path]);
      return;
    }
    backtrack(i + 1);
    path.push(nums[i]);
    backtrack(i + 1);
    path.pop();
  }

  backtrack(0);
  return result;
}

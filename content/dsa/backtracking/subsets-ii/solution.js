/**
 * @param {number[]} nums may contain duplicates
 * @return {number[][]}
 */
export default function subsetsWithDup(nums) {
  // sorting puts equal values side by side so repeats are easy to skip
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  const path = [];
  const dfs = (start) => {
    // every path, including the empty one, is a subset
    result.push([...path]);
    for (let i = start; i < sorted.length; i++) {
      // the same value at the same depth would build the same subsets again
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      path.push(sorted[i]);
      dfs(i + 1);
      path.pop();
    }
  };
  dfs(0);
  return result;
}

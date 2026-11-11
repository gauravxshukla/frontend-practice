/**
 * @param {number[]} nums houses arranged in a circle
 * @return {number}
 */
export default function rob(nums) {
  // with one house there is no neighbour conflict to split around
  if (nums.length === 1) return nums[0];
  // straight-line House Robber over nums[lo..hi]
  const robLine = (lo, hi) => {
    let twoBack = 0;
    let oneBack = 0;
    for (let i = lo; i <= hi; i++) {
      const best = Math.max(oneBack, twoBack + nums[i]);
      twoBack = oneBack;
      oneBack = best;
    }
    return oneBack;
  };
  // the first and last houses touch, so at least one of them is left out
  return Math.max(robLine(0, nums.length - 2), robLine(1, nums.length - 1));
}

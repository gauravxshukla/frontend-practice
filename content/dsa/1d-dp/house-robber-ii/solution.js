/**
 * @param {number[]} nums
 * @return {number}
 */
export default function rob(nums) {
  if (nums.length === 1) return nums[0];
  // The first and last houses are neighbours, so at most one of them is robbed:
  // solve the straight-line problem twice, once without each end.
  return Math.max(robLine(nums, 0, nums.length - 2), robLine(nums, 1, nums.length - 1));
}

function robLine(nums, from, to) {
  let skipPrev = 0;
  let takePrev = 0;
  for (let i = from; i <= to; i++) {
    const current = Math.max(takePrev, skipPrev + nums[i]);
    skipPrev = takePrev;
    takePrev = current;
  }
  return takePrev;
}

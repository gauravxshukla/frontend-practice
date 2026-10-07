/**
 * @param {number[]} nums
 * @return {boolean}
 */
export default function canJump(nums) {
  let reach = 0; // furthest index we can get to so far

  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false; // stuck before index i
    reach = Math.max(reach, i + nums[i]);
    if (reach >= nums.length - 1) return true;
  }
  return true;
}

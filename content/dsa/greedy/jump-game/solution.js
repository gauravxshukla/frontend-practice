/**
 * @param {number[]} nums
 * @return {boolean}
 */
export default function canJump(nums) {
  let reach = 0; // farthest index we know we can land on
  for (let i = 0; i < nums.length; i++) {
    // i is beyond anything reachable, so the end is too
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}

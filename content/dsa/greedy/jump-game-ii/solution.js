/**
 * @param {number[]} nums the last index is always reachable
 * @return {number}
 */
export default function jump(nums) {
  let jumps = 0;
  let windowEnd = 0; // last index reachable with the current number of jumps
  let farthest = 0; // farthest index reachable with one more jump
  // the last index needs no jump out of it
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    // leaving the current window costs one jump, landing anywhere up to farthest
    if (i === windowEnd) {
      jumps++;
      windowEnd = farthest;
    }
  }
  return jumps;
}

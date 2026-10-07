/**
 * @param {number[]} nums
 * @return {number}
 */
export default function rob(nums) {
  // best(i) = max(best(i - 1), best(i - 2) + nums[i]); keep only the last two values.
  let skipPrev = 0; // best total up to house i - 2
  let takePrev = 0; // best total up to house i - 1
  for (const money of nums) {
    const current = Math.max(takePrev, skipPrev + money);
    skipPrev = takePrev;
    takePrev = current;
  }
  return takePrev;
}

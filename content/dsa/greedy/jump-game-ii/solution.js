/**
 * Greedy BFS by levels.
 * @param {number[]} nums
 * @return {number}
 */
export default function jump(nums) {
  let jumps = 0;
  let end = 0; // last index reachable with `jumps` jumps
  let farthest = 0; // last index reachable with `jumps + 1` jumps

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === end) {
      jumps++;
      end = farthest;
    }
  }
  return jumps;
}

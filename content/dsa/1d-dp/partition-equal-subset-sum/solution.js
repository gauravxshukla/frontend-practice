/**
 * @param {number[]} nums
 * @return {boolean}
 */
export default function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  // an odd total can't be split into two equal integer halves
  if (total % 2 !== 0) return false;
  const target = total / 2;
  // can[s]: some subset of the numbers seen so far sums to s
  const can = new Array(target + 1).fill(false);
  can[0] = true;
  for (const num of nums) {
    // go downward so this num is used at most once per pass
    for (let s = target; s >= num; s--) {
      if (can[s - num]) can[s] = true;
    }
  }
  return can[target];
}

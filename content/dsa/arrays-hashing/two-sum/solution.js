/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
export default function twoSum(nums, target) {
  const seen = new Map(); // value -> index of numbers visited so far
  for (let i = 0; i < nums.length; i++) {
    // if the partner was seen earlier, we have the pair
    if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
    // store after checking so a number never pairs with itself
    seen.set(nums[i], i);
  }
  return []; // unreachable: exactly one answer is guaranteed
}

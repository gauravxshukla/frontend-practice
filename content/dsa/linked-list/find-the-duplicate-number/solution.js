/**
 * @param {number[]} nums n + 1 values, each in 1..n
 * @return {number}
 */
export default function findDuplicate(nums) {
  // reading i -> nums[i] as "next" makes a list; the duplicate is where the cycle starts
  let slow = 0;
  let fast = 0;
  // phase 1: find any meeting point inside the cycle
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  // phase 2: from the start and the meeting point, equal steps meet at the cycle entrance
  let finder = 0;
  while (finder !== slow) {
    finder = nums[finder];
    slow = nums[slow];
  }
  return finder;
}

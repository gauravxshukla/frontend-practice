/**
 * @param {number[]} nums n + 1 values, each in 1..n
 * @return {number} the repeated value
 */
export default function findDuplicate(nums) {
  // Treat i -> nums[i] as a linked list. The duplicate value is the entry of its cycle (Floyd).
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  // Restart one pointer from the start; they meet at the cycle entrance.
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}

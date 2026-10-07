/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
export default function maxSlidingWindow(nums, k) {
  // Monotonic deque of indices; their values are strictly decreasing front to back.
  const deque = new Array(nums.length);
  let head = 0;
  let tail = 0; // deque occupies deque[head..tail)
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // Drop the front index once it slides out of the window.
    if (head < tail && deque[head] <= i - k) head++;
    // Smaller values behind nums[i] can never be a maximum again.
    while (head < tail && nums[deque[tail - 1]] <= nums[i]) tail--;
    deque[tail++] = i;

    if (i >= k - 1) result.push(nums[deque[head]]);
  }
  return result;
}

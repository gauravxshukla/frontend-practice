/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
export default function maxSlidingWindow(nums, k) {
  const dq = []; // indices whose values decrease from front to back
  let head = 0; // front of the deque (an index into dq, so shifting is O(1))
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    // smaller values behind a bigger newcomer can never be a window max again
    while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    // the front index slid out of the window
    if (dq[head] <= i - k) head++;
    // once the first full window exists, the front holds its max
    if (i >= k - 1) result.push(nums[dq[head]]);
  }
  return result;
}

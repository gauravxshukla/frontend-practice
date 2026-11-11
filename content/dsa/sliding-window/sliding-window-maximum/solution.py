class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        dq = deque()  # indices whose values decrease from front to back
        result = []
        for i in range(len(nums)):
            # smaller values behind a bigger newcomer can never be a window max again
            while dq and nums[dq[-1]] <= nums[i]:
                dq.pop()
            dq.append(i)
            # the front index slid out of the window
            if dq[0] <= i - k:
                dq.popleft()
            # once the first full window exists, the front holds its max
            if i >= k - 1:
                result.append(nums[dq[0]])
        return result

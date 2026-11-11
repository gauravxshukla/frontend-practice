class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        answer = [0] * n
        # pass 1: answer[i] = product of everything to the left of i
        left = 1
        for i in range(n):
            answer[i] = left
            left *= nums[i]
        # pass 2: multiply in the product of everything to the right of i
        right = 1
        for i in range(n - 1, -1, -1):
            answer[i] *= right
            right *= nums[i]
        # the output array is the only extra memory, and no division handles zeros
        return answer

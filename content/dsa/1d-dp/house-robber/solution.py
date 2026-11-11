class Solution:
    def rob(self, nums: List[int]) -> int:
        two_back = 0  # best total up to the house before the previous one
        one_back = 0  # best total up to the previous house
        for house in nums:
            # skip this house (keep one_back) or rob it on top of two_back
            best = max(one_back, two_back + house)
            two_back = one_back
            one_back = best
        return one_back

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        # tails[k] = smallest tail value of any increasing subsequence of length k + 1 (kept sorted)
        tails = []
        for num in nums:
            # find the first tail >= num (>= keeps the subsequence strictly increasing)
            lo, hi = 0, len(tails)
            while lo < hi:
                mid = (lo + hi) // 2
                if tails[mid] < num:
                    lo = mid + 1
                else:
                    hi = mid
            # a smaller tail for that length leaves more room to extend later; past the end, it's a new length
            if lo == len(tails):
                tails.append(num)
            else:
                tails[lo] = num
        return len(tails)

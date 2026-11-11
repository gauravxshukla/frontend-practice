class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        # sorting lets pointers steer the sum and puts duplicates side by side
        nums = sorted(nums)
        result = []
        for i in range(len(nums) - 2):
            # the same first value would only repeat triplets already found
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            # a positive smallest value can't reach a sum of 0
            if nums[i] > 0:
                break
            l, r = i + 1, len(nums) - 1
            while l < r:
                total = nums[i] + nums[l] + nums[r]
                if total < 0:  # need a bigger total
                    l += 1
                elif total > 0:  # need a smaller total
                    r -= 1
                else:
                    result.append([nums[i], nums[l], nums[r]])
                    l += 1
                    r -= 1
                    # step past equal values so this triplet isn't added again
                    while l < r and nums[l] == nums[l - 1]:
                        l += 1
                    while l < r and nums[r] == nums[r + 1]:
                        r -= 1
        return result

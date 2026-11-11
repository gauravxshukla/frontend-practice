class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        # how often each value appears
        freq = {}
        for n in nums:
            freq[n] = freq.get(n, 0) + 1

        # a count is between 1 and n, so index buckets by count (n + 1 slots)
        buckets = [[] for _ in range(len(nums) + 1)]
        for value, count in freq.items():
            buckets[count].append(value)

        # the highest counts come first when scanning buckets from the top
        result = []
        for c in range(len(buckets) - 1, 0, -1):
            for value in buckets[c]:
                result.append(value)
                if len(result) == k:
                    return result
        return result

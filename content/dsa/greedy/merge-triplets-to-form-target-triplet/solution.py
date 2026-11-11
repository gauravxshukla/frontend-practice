class Solution:
    def mergeTriplets(self, triplets: List[List[int]], target: List[int]) -> bool:
        found = [False, False, False]  # which target positions some safe triplet matches
        for t in triplets:
            # merging takes the max, so any value above the target can never be undone
            if t[0] > target[0] or t[1] > target[1] or t[2] > target[2]:
                continue
            for i in range(3):
                if t[i] == target[i]:
                    found[i] = True
        return found[0] and found[1] and found[2]

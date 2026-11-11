class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = {}  # signature -> words with that signature
        for word in strs:
            # anagrams have identical letter counts, so the counts identify the group
            counts = [0] * 26
            for ch in word:
                counts[ord(ch) - ord("a")] += 1
            # the separator keeps counts like [1, 11] and [11, 1] from colliding
            key = "#".join(map(str, counts))
            if key not in groups:
                groups[key] = []
            groups[key].append(word)
        return list(groups.values())

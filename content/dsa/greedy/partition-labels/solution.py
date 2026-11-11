class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        # where each letter appears for the last time
        last = {ch: i for i, ch in enumerate(s)}
        sizes = []
        start = end = 0  # the current part must reach at least end
        for i, ch in enumerate(s):
            end = max(end, last[ch])
            # every letter seen in this part ends by i, so it can close here
            if i == end:
                sizes.append(end - start + 1)
                start = i + 1
        return sizes

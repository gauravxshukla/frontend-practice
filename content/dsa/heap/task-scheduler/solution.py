class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        counts = [0] * 26
        for t in tasks:
            counts[ord(t) - ord("A")] += 1
        max_count = max(counts)
        # tasks tied for the highest count all sit in the final row
        with_max = sum(1 for c in counts if c == max_count)
        # (max_count - 1) full frames of n + 1 slots, then one last row of the busiest tasks
        framed = (max_count - 1) * (n + 1) + with_max
        # if other tasks overflow the gaps, no idling is needed at all
        return max(len(tasks), framed)

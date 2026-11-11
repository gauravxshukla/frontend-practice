class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        adj = [[] for _ in range(n + 1)]
        for u, v, w in times:
            adj[u].append((v, w))
        settled = {}  # node -> final shortest time
        # min-heap of (time, node): the closest unsettled node comes out first
        heap = [(0, k)]
        while heap:
            time, node = heappop(heap)
            # an older, longer entry for a node that's already settled
            if node in settled:
                continue
            settled[node] = time
            for nxt, w in adj[node]:
                if nxt not in settled:
                    heappush(heap, (time + w, nxt))
        # the signal needs as long as the farthest node takes; unreachable nodes make it impossible
        if len(settled) < n:
            return -1
        return max(settled.values())

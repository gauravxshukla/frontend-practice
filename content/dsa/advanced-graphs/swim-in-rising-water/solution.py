class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n = len(grid)
        seen = [[False] * n for _ in range(n)]
        # min-heap of (highest elevation on the path so far, r, c)
        heap = [(grid[0][0], 0, 0)]  # the start cell's height counts too
        seen[0][0] = True
        while heap:
            time, r, c = heappop(heap)
            # popped in order of path maximum, so the first arrival is the best
            if r == n - 1 and c == n - 1:
                return time
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if nr < 0 or nr >= n or nc < 0 or nc >= n or seen[nr][nc]:
                    continue
                seen[nr][nc] = True
                # stepping onto a higher cell raises the time needed for this path
                heappush(heap, (max(time, grid[nr][nc]), nr, nc))
        return -1  # unreachable: the grid is always connected

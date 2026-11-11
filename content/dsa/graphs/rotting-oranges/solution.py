class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        fresh = 0
        queue = []  # the oranges that rotted most recently
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    fresh += 1
                elif grid[r][c] == 2:
                    queue.append((r, c))
        minutes = 0
        # each round spreads rot one step from every newly rotten orange: one minute
        while queue and fresh > 0:
            nxt = []
            for r, c in queue:
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nr, nc = r + dr, c + dc
                    if nr < 0 or nr >= rows or nc < 0 or nc >= cols or grid[nr][nc] != 1:
                        continue
                    grid[nr][nc] = 2
                    fresh -= 1
                    nxt.append((nr, nc))
            queue = nxt
            minutes += 1
        # any fresh orange left was never reachable
        return minutes if fresh == 0 else -1

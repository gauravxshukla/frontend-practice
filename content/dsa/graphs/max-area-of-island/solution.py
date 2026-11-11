class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])

        # area of the island containing (r, c), sinking it as we count
        def area(r: int, c: int) -> int:
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != 1:
                return 0
            grid[r][c] = 0  # mark first so neighbours don't count this cell again
            return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1)

        best = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    best = max(best, area(r, c))
        return best

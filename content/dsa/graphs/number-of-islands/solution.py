class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        rows, cols = len(grid), len(grid[0])

        # sink every land cell connected to (r, c) so it isn't counted again
        def sink(r: int, c: int) -> None:
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
                return
            grid[r][c] = "0"
            sink(r + 1, c)
            sink(r - 1, c)
            sink(r, c + 1)
            sink(r, c - 1)

        islands = 0
        for r in range(rows):
            for c in range(cols):
                # land the scan hasn't sunk yet starts a new island
                if grid[r][c] == "1":
                    islands += 1
                    sink(r, c)
        return islands

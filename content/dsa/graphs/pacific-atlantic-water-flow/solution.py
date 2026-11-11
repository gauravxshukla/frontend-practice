class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        rows, cols = len(heights), len(heights[0])
        pacific = [[False] * cols for _ in range(rows)]
        atlantic = [[False] * cols for _ in range(rows)]

        # climb from the ocean: a neighbour at least as high can drain into this cell
        def climb(r: int, c: int, seen: List[List[bool]]) -> None:
            seen[r][c] = True
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if nr < 0 or nr >= rows or nc < 0 or nc >= cols or seen[nr][nc]:
                    continue
                if heights[nr][nc] >= heights[r][c]:
                    climb(nr, nc, seen)

        # top/left edges touch the Pacific, bottom/right edges the Atlantic
        for r in range(rows):
            climb(r, 0, pacific)
            climb(r, cols - 1, atlantic)
        for c in range(cols):
            climb(0, c, pacific)
            climb(rows - 1, c, atlantic)
        return [[r, c] for r in range(rows) for c in range(cols) if pacific[r][c] and atlantic[r][c]]

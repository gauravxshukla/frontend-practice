class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        rows, cols = len(matrix), len(matrix[0])
        # memo[r][c] = length of the longest increasing path starting at (r, c); 0 = not computed
        memo = [[0] * cols for _ in range(rows)]

        def best(r: int, c: int) -> int:
            if memo[r][c]:
                return memo[r][c]
            longest = 1  # the cell on its own
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                # strictly larger neighbours only, which also rules out cycles
                if nr < 0 or nr >= rows or nc < 0 or nc >= cols or matrix[nr][nc] <= matrix[r][c]:
                    continue
                longest = max(longest, 1 + best(nr, nc))
            memo[r][c] = longest
            return longest

        return max(best(r, c) for r in range(rows) for c in range(cols))

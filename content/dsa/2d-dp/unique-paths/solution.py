class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        # row[c] = paths to column c of the current row; the top row has one path per cell
        row = [1] * n
        for _ in range(1, m):
            # row[c] still holds the cell above; row[c - 1] is the cell to the left
            for c in range(1, n):
                row[c] += row[c - 1]
        return row[n - 1]

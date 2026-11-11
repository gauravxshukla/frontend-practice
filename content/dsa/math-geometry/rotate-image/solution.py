class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        # 1. transpose: swap across the main diagonal (upper triangle only, or pairs swap back)
        for r in range(n):
            for c in range(r + 1, n):
                matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
        # 2. mirror each row left to right; together the two steps are a clockwise turn
        for row in matrix:
            row.reverse()

class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        rows, cols = len(matrix), len(matrix[0])
        # matrix[0][0] marks row 0, so column 0 needs its own flag
        first_col_zero = False
        # 1. record zeros in the first row/column (the markers)
        for r in range(rows):
            if matrix[r][0] == 0:
                first_col_zero = True
            for c in range(1, cols):
                if matrix[r][c] == 0:
                    matrix[r][0] = 0
                    matrix[0][c] = 0
        # 2. zero inner cells whose row or column is marked
        for r in range(1, rows):
            for c in range(1, cols):
                if matrix[r][0] == 0 or matrix[0][c] == 0:
                    matrix[r][c] = 0
        # 3. the markers themselves go last, so they weren't overwritten while still needed
        if matrix[0][0] == 0:
            for c in range(cols):
                matrix[0][c] = 0
        if first_col_zero:
            for r in range(rows):
                matrix[r][0] = 0

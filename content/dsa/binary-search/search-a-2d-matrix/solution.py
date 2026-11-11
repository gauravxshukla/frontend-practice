class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        rows, cols = len(matrix), len(matrix[0])
        # read row by row, the matrix is one sorted list of rows * cols values
        l, r = 0, rows * cols - 1
        while l <= r:
            mid = l + (r - l) // 2
            # turn the flat index back into a cell
            value = matrix[mid // cols][mid % cols]
            if value == target:
                return True
            if value < target:
                l = mid + 1
            else:
                r = mid - 1
        return False

class Solution:
    def solve(self, board: List[List[str]]) -> None:
        rows, cols = len(board), len(board[0])

        # an 'O' connected to the border can't be surrounded: mark it safe ('S')
        def mark_safe(r: int, c: int) -> None:
            if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != "O":
                return
            board[r][c] = "S"
            mark_safe(r + 1, c)
            mark_safe(r - 1, c)
            mark_safe(r, c + 1)
            mark_safe(r, c - 1)

        for r in range(rows):
            mark_safe(r, 0)
            mark_safe(r, cols - 1)
        for c in range(cols):
            mark_safe(0, c)
            mark_safe(rows - 1, c)
        # unmarked 'O's are enclosed, so capture them; safe cells go back to 'O'
        for r in range(rows):
            for c in range(cols):
                if board[r][c] == "O":
                    board[r][c] = "X"
                elif board[r][c] == "S":
                    board[r][c] = "O"

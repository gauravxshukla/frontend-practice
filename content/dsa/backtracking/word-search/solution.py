class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])

        # can word[i:] be traced starting at (r, c)?
        def dfs(r: int, c: int, i: int) -> bool:
            if i == len(word):
                return True
            # off the board, wrong letter, or already on this path ('#')
            if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:
                return False
            ch = board[r][c]
            board[r][c] = "#"  # mark: a cell can't be reused within one path
            found = dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1)
            board[r][c] = ch  # restore for other paths
            return found

        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, 0):
                    return True
        return False

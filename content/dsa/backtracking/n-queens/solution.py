class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        result = []
        queen_col = [-1] * n  # column of the queen in each row
        # columns and both diagonal directions already under attack
        cols = set()
        diag = set()  # r - c is constant along a "\" diagonal
        anti = set()  # r + c is constant along a "/" diagonal

        def dfs(r: int) -> None:
            # a queen in every row: turn the placement into board strings
            if r == n:
                result.append(["." * c + "Q" + "." * (n - c - 1) for c in queen_col])
                return
            for c in range(n):
                if c in cols or (r - c) in diag or (r + c) in anti:
                    continue
                # place, explore the next row, then remove the queen
                queen_col[r] = c
                cols.add(c)
                diag.add(r - c)
                anti.add(r + c)
                dfs(r + 1)
                cols.remove(c)
                diag.remove(r - c)
                anti.remove(r + c)

        dfs(0)
        return result

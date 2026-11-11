class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        # one set of seen digits per row, per column and per 3x3 box
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]

        for r in range(9):
            for c in range(9):
                d = board[r][c]
                # empty cells can't break a rule
                if d == ".":
                    continue
                # boxes are numbered 0-8, left to right then top to bottom
                b = (r // 3) * 3 + c // 3
                # a digit seen before in any of its three units is a repeat
                if d in rows[r] or d in cols[c] or d in boxes[b]:
                    return False
                rows[r].add(d)
                cols[c].add(d)
                boxes[b].add(d)
        return True

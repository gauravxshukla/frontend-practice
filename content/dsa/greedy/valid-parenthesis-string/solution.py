class Solution:
    def checkValidString(self, s: str) -> bool:
        # fewest and most unmatched '(' possible after reading each prefix
        lo = hi = 0
        for ch in s:
            if ch == "(":
                lo += 1
                hi += 1
            elif ch == ")":
                lo -= 1
                hi -= 1
            else:
                lo -= 1  # '*' read as ')'
                hi += 1  # '*' read as '('
            # even treating every '*' as '(' can't cover the ')'s seen
            if hi < 0:
                return False
            # a negative count isn't a real option: those '*' would have been empty instead
            lo = max(lo, 0)
        # some choice of '*'s closes every '('
        return lo == 0

class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        result = []

        def build(current: str, open_: int, close: int) -> None:
            # every pair is placed, and the rules below kept it valid
            if len(current) == 2 * n:
                result.append(current)
                return
            # an opener is allowed while some are still unused
            if open_ < n:
                build(current + "(", open_ + 1, close)
            # a closer is allowed only if it has an unmatched opener
            if close < open_:
                build(current + ")", open_, close + 1)

        build("", 0, 0)
        return result

class Solution:
    def partition(self, s: str) -> List[List[str]]:
        # two pointers moving inward check s[l..r]
        def is_palindrome(l: int, r: int) -> bool:
            while l < r:
                if s[l] != s[r]:
                    return False
                l += 1
                r -= 1
            return True

        result = []
        path = []

        def dfs(start: int) -> None:
            # the whole string is cut into palindromes
            if start == len(s):
                result.append(path[:])
                return
            for end in range(start, len(s)):
                # only a palindromic piece can be cut off, which prunes everything else early
                if not is_palindrome(start, end):
                    continue
                path.append(s[start : end + 1])
                dfs(end + 1)
                path.pop()

        dfs(0)
        return result

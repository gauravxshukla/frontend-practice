class Solution:
    def isPalindrome(self, s: str) -> bool:
        l, r = 0, len(s) - 1
        while l < r:
            # symbols and spaces don't count, so step over them
            if not s[l].isalnum():
                l += 1
            elif not s[r].isalnum():
                r -= 1
            else:
                # the mirrored characters must match, ignoring case
                if s[l].lower() != s[r].lower():
                    return False
                l += 1
                r -= 1
        # pointers met without a mismatch (also true for empty or all-symbol input)
        return True

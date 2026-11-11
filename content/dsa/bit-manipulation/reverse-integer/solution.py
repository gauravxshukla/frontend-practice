class Solution:
    def reverse(self, x: int) -> int:
        sign = -1 if x < 0 else 1
        rest = abs(x)
        # largest magnitude allowed: 2^31 - 1 for positives, 2^31 for negatives
        limit = 2147483647 if sign > 0 else 2147483648
        rev = 0
        while rest > 0:
            digit = rest % 10
            rest //= 10
            # rev * 10 + digit would pass the limit: report overflow before it happens
            if rev > (limit - digit) // 10:
                return 0
            rev = rev * 10 + digit
        return sign * rev

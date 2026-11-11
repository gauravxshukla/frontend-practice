class Solution:
    def myPow(self, x: float, n: int) -> float:
        # a negative power is the positive power of the reciprocal
        base = 1 / x if n < 0 else x
        exp = abs(n)
        result = 1.0
        while exp > 0:
            # the lowest bit of exp is set: this power of base is part of the answer
            if exp % 2 == 1:
                result *= base
            # move to the next bit: base^(2k), half the exponent
            base *= base
            exp //= 2
        return result

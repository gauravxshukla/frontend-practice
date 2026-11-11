class Solution:
    def reverseBits(self, n: int) -> int:
        result = 0
        # all 32 positions, because leading zeros become trailing ones' places
        for _ in range(32):
            # move n's lowest bit onto the right end of result
            result = (result << 1) | (n & 1)
            n >>= 1
        return result

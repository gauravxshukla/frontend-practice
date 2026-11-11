class Solution:
    def countBits(self, n: int) -> List[int]:
        bits = [0] * (n + 1)
        for i in range(1, n + 1):
            # i >> 1 is i without its last bit (already counted); add that last bit back
            bits[i] = bits[i >> 1] + (i & 1)
        return bits

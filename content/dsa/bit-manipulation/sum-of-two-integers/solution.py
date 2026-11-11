class Solution:
    def getSum(self, a: int, b: int) -> int:
        # Python ints are unbounded, so keep every step to 32 bits by hand
        MASK = 0xFFFFFFFF
        a &= MASK
        b &= MASK
        while b != 0:
            # bits where both are 1 produce a carry into the next position
            carry = ((a & b) << 1) & MASK
            # XOR adds each bit position without the carry
            a = (a ^ b) & MASK
            b = carry
        # read the 32-bit pattern back as a signed number
        return a if a <= 0x7FFFFFFF else ~(a ^ MASK)

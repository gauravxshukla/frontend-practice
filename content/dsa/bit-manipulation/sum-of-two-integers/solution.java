class Solution {
    public int getSum(int a, int b) {
        // Java ints are 32-bit two's complement, so negatives work unchanged
        while (b != 0) {
            // bits where both are 1 produce a carry into the next position
            int carry = (a & b) << 1;
            // XOR adds each bit position without the carry
            a = a ^ b;
            b = carry;
        }
        return a;
    }
}

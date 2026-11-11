class Solution {
    public long reverseBits(long n) {
        long result = 0;
        // all 32 positions, because leading zeros become trailing ones' places
        for (int i = 0; i < 32; i++) {
            // move n's lowest bit onto the right end of result
            result = (result << 1) | (n & 1);
            n >>= 1;
        }
        return result;
    }
}

class Solution {
    public int hammingWeight(long n) {
        int count = 0;
        // the runner passes a long, so values >= 2^31 stay positive
        while (n != 0) {
            // n & (n - 1) clears the lowest set bit: one iteration per 1 bit
            n &= n - 1;
            count++;
        }
        return count;
    }
}

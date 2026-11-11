class Solution {
    public int[] countBits(int n) {
        int[] bits = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            // i >> 1 is i without its last bit (already counted); add that last bit back
            bits[i] = bits[i >> 1] + (i & 1);
        }
        return bits;
    }
}

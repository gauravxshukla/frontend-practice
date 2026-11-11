class Solution {
    public double myPow(double x, int n) {
        // Fast exponentiation by squaring; long avoids overflow on -n for Integer.MIN_VALUE.
        long e = n;
        if (e < 0) {
            x = 1 / x;
            e = -e;
        }
        double result = 1;
        while (e > 0) {
            if ((e & 1) == 1) result *= x;
            x *= x;
            e >>= 1;
        }
        return result;
    }
}

class Solution {
    public double myPow(double x, int n) {
        // long: negating Integer.MIN_VALUE overflows an int
        long exp = n;
        // a negative power is the positive power of the reciprocal
        double base = exp < 0 ? 1 / x : x;
        exp = Math.abs(exp);
        double result = 1;
        while (exp > 0) {
            // the lowest bit of exp is set: this power of base is part of the answer
            if (exp % 2 == 1) result *= base;
            // move to the next bit: base^(2k), half the exponent
            base *= base;
            exp /= 2;
        }
        return result;
    }
}

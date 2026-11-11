class Solution {
    public int reverse(int x) {
        int sign = x < 0 ? -1 : 1;
        // long: Math.abs(Integer.MIN_VALUE) doesn't fit in an int
        long rest = Math.abs((long) x);
        // largest magnitude allowed: 2^31 - 1 for positives, 2^31 for negatives
        long limit = sign > 0 ? 2147483647L : 2147483648L;
        long rev = 0;
        while (rest > 0) {
            int digit = (int) (rest % 10);
            rest /= 10;
            // rev * 10 + digit would pass the limit: report overflow before it happens
            if (rev > (limit - digit) / 10) return 0;
            rev = rev * 10 + digit;
        }
        return (int) (sign * rev);
    }
}

class Solution {
    public boolean isHappy(int n) {
        // the sequence must loop eventually; fast and slow pointers find that loop
        int slow = next(n);
        int fast = next(next(n));
        while (slow != fast) {
            slow = next(slow);
            fast = next(next(fast));
        }
        // 1 loops back to itself, so meeting at 1 means happy
        return slow == 1;
    }

    // the next number in the sequence: sum of the squares of the digits
    private int next(int x) {
        int sum = 0;
        while (x > 0) {
            int d = x % 10;
            sum += d * d;
            x /= 10;
        }
        return sum;
    }
}

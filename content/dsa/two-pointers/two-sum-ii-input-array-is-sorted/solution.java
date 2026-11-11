class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int l = 0;
        int r = numbers.length - 1;
        while (l < r) {
            int sum = numbers[l] + numbers[r];
            // found it; the problem wants 1-indexed positions
            if (sum == target) return new int[] {l + 1, r + 1};
            // too small: only a bigger left value can raise the sum
            if (sum < target) l++;
            // too big: only a smaller right value can lower it
            else r--;
        }
        return new int[0]; // unreachable: exactly one answer is guaranteed
    }
}

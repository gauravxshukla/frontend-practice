class Solution {
    public int change(int amount, int[] coins) {
        // ways[a] = combinations of the coins processed so far that make a
        int[] ways = new int[amount + 1];
        ways[0] = 1; // one way to make 0: use nothing
        // one coin at a time: combinations are built in coin order, so none is counted twice
        for (int coin : coins) {
            // ascending a lets the same coin be used again
            for (int a = coin; a <= amount; a++) ways[a] += ways[a - coin];
        }
        return ways[amount];
    }
}

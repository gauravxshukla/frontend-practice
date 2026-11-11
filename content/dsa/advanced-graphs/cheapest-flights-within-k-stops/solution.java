class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        final int INF = Integer.MAX_VALUE;
        int[] prices = new int[n]; // cheapest cost found with the flights allowed so far
        Arrays.fill(prices, INF);
        prices[src] = 0;
        // round i allows one more flight, so k + 1 rounds allow k stops
        for (int round = 0; round <= k; round++) {
            // extend from last round's costs only, so each round adds at most one flight
            int[] next = prices.clone();
            for (int[] f : flights) {
                if (prices[f[0]] == INF) continue;
                next[f[1]] = Math.min(next[f[1]], prices[f[0]] + f[2]);
            }
            prices = next;
        }
        return prices[dst] == INF ? -1 : prices[dst];
    }
}

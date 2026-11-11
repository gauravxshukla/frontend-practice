class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE; // cheapest buy seen so far
        int best = 0; // never negative: not trading is allowed
        for (int price : prices) {
            // a lower price is a better buy for every later day
            minPrice = Math.min(minPrice, price);
            // selling today against the cheapest earlier buy
            best = Math.max(best, price - minPrice);
        }
        return best;
    }
}

class Solution {
    public int maxProfit(int[] prices) {
        // best profit so far if today ends holding a share, having just sold, or resting (free to buy)
        int hold = Integer.MIN_VALUE / 2; // "impossible", with room so adding a price can't overflow
        int sold = 0;
        int rest = 0;
        for (int price : prices) {
            // all three use yesterday's values
            int newHold = Math.max(hold, rest - price); // keep holding, or buy from a rest day
            int newSold = hold + price; // sell what we held
            int newRest = Math.max(rest, sold); // keep resting, or finish the cooldown
            hold = newHold;
            sold = newSold;
            rest = newRest;
        }
        // ending while holding a share is never best
        return Math.max(sold, rest);
    }
}

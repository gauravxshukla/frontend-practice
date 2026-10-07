/**
 * @param {number[]} prices
 * @return {number}
 */
export default function maxProfit(prices) {
  let minBuyPrice = Infinity;
  let best = 0;

  for (let i = 0; i < prices.length; i++) {
    if (minBuyPrice > prices[i]) {
      minBuyPrice = prices[i];
    } else {
      best = Math.max(best, prices[i] - minBuyPrice);
    }
  }

  return best;
}

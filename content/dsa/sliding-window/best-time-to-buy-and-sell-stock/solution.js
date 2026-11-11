/**
 * @param {number[]} prices
 * @return {number}
 */
export default function maxProfit(prices) {
  let minPrice = Infinity; // cheapest buy seen so far
  let best = 0; // never negative: not trading is allowed
  for (const price of prices) {
    // a lower price is a better buy for every later day
    minPrice = Math.min(minPrice, price);
    // selling today against the cheapest earlier buy
    best = Math.max(best, price - minPrice);
  }
  return best;
}

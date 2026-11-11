/**
 * @param {number[]} prices
 * @return {number}
 */
export default function maxProfit(prices) {
  // best profit so far if today ends holding a share, having just sold, or resting (free to buy)
  let hold = -Infinity;
  let sold = 0;
  let rest = 0;
  for (const price of prices) {
    // all three use yesterday's values
    const newHold = Math.max(hold, rest - price); // keep holding, or buy from a rest day
    const newSold = hold + price; // sell what we held
    const newRest = Math.max(rest, sold); // keep resting, or finish the cooldown
    hold = newHold;
    sold = newSold;
    rest = newRest;
  }
  // ending while holding a share is never best
  return Math.max(sold, rest);
}

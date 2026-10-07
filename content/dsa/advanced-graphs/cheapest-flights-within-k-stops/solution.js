/**
 * @param {number} n  cities 0..n-1
 * @param {number[][]} flights  directed [from, to, price]
 * @param {number} src
 * @param {number} dst
 * @param {number} k  maximum number of intermediate stops
 * @return {number} the cheapest price using at most k stops, or -1
 */
export default function findCheapestPrice(n, flights, src, dst, k) {
  // Bellman-Ford limited to k + 1 rounds: after round i, prices[v] is the cheapest
  // cost using at most i flights.
  let prices = new Array(n).fill(Infinity);
  prices[src] = 0;
  for (let round = 0; round <= k; round++) {
    // Relax from the previous round's snapshot so one round adds at most one flight.
    const next = prices.slice();
    for (const [from, to, price] of flights) {
      if (prices[from] + price < next[to]) next[to] = prices[from] + price;
    }
    prices = next;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}

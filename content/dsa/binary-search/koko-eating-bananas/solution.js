/**
 * @param {number[]} piles
 * @param {number} h
 * @return {number}
 */
export default function minEatingSpeed(piles, h) {
  // hours needed at speed k: each pile takes ceil(pile / k) hours
  const hoursAt = (k) => piles.reduce((sum, pile) => sum + Math.ceil(pile / k), 0);
  // the answer is between 1 and the biggest pile (one pile per hour)
  let l = 1;
  let r = Math.max(...piles);
  while (l < r) {
    const mid = l + Math.floor((r - l) / 2);
    // fast enough: mid works, but a slower speed might too
    if (hoursAt(mid) <= h) r = mid;
    // too slow: every speed up to mid is too slow
    else l = mid + 1;
  }
  return l;
}

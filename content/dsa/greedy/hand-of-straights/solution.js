/**
 * @param {number[]} hand
 * @param {number} groupSize
 * @return {boolean}
 */
export default function isNStraightHand(hand, groupSize) {
  // the cards must split into whole groups
  if (hand.length % groupSize !== 0) return false;
  const count = new Map();
  for (const card of hand) count.set(card, (count.get(card) ?? 0) + 1);
  const sorted = [...hand].sort((a, b) => a - b);
  for (const card of sorted) {
    // already used by an earlier run
    if (count.get(card) === 0) continue;
    // the smallest card left can only be the start of a run, so build it now
    for (let v = card; v < card + groupSize; v++) {
      if (!count.get(v)) return false;
      count.set(v, count.get(v) - 1);
    }
  }
  return true;
}

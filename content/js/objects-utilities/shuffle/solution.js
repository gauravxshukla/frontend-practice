/**
 * @template T
 * @param {Array<T>} array
 * @param {() => number} [random=Math.random]
 * @return {Array<T>}
 */
export default function shuffle(array, random = Math.random) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    // Pick uniformly from the not-yet-fixed prefix 0..i (inclusive).
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * @param {string} s
 * @return {number[]} part sizes
 */
export default function partitionLabels(s) {
  // where each letter appears for the last time
  const last = new Map();
  for (let i = 0; i < s.length; i++) last.set(s[i], i);
  const sizes = [];
  let start = 0;
  let end = 0; // the current part must reach at least this far
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last.get(s[i]));
    // every letter seen in this part ends by i, so it can close here
    if (i === end) {
      sizes.push(end - start + 1);
      start = i + 1;
    }
  }
  return sizes;
}

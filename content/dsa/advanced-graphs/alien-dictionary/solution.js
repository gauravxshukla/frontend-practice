/**
 * @param {string[]} words sorted in the alien order
 * @return {string} one valid letter order, or "" if none exists
 */
export default function alienOrder(words) {
  // every letter that appears must be in the answer, even with no rules
  const after = new Map(); // letter -> letters that must come after it
  const needs = new Map(); // letter -> how many letters must come before it
  for (const w of words) {
    for (const ch of w) {
      if (!after.has(ch)) {
        after.set(ch, new Set());
        needs.set(ch, 0);
      }
    }
  }
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i];
    const b = words[i + 1];
    // a longer word before its own prefix can't be sorted by any order
    if (a.length > b.length && a.startsWith(b)) return '';
    // only the first differing letter tells us anything
    for (let j = 0; j < Math.min(a.length, b.length); j++) {
      if (a[j] !== b[j]) {
        if (!after.get(a[j]).has(b[j])) {
          after.get(a[j]).add(b[j]);
          needs.set(b[j], needs.get(b[j]) + 1);
        }
        break;
      }
    }
  }
  // Kahn's topological sort: emit letters once nothing must precede them
  const ready = [...needs.keys()].filter((ch) => needs.get(ch) === 0);
  let order = '';
  while (ready.length) {
    const ch = ready.pop();
    order += ch;
    for (const next of after.get(ch)) {
      needs.set(next, needs.get(next) - 1);
      if (needs.get(next) === 0) ready.push(next);
    }
  }
  // letters left out are on a cycle of contradictory rules
  return order.length === after.size ? order : '';
}

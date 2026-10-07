/**
 * @param {string[]} words  sorted in the alien language's order
 * @return {string} the letters in a consistent order, or "" if none exists
 */
export default function alienOrder(words) {
  // Every letter that appears is a node, even if it has no edges.
  const edges = new Map();
  const indegree = new Map();
  for (const word of words) {
    for (const ch of word) {
      if (!edges.has(ch)) {
        edges.set(ch, new Set());
        indegree.set(ch, 0);
      }
    }
  }

  // Adjacent words give at most one rule: their first differing letters.
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i];
    const b = words[i + 1];
    const len = Math.min(a.length, b.length);
    let j = 0;
    while (j < len && a[j] === b[j]) j++;
    if (j === len) {
      if (a.length > b.length) return ''; // "abc" before "ab" is impossible
      continue;
    }
    if (!edges.get(a[j]).has(b[j])) {
      edges.get(a[j]).add(b[j]);
      indegree.set(b[j], indegree.get(b[j]) + 1);
    }
  }

  // Kahn's topological sort; leftover letters mean a cycle.
  const order = [];
  for (const [ch, d] of indegree) if (d === 0) order.push(ch);
  for (let head = 0; head < order.length; head++) {
    for (const next of edges.get(order[head])) {
      indegree.set(next, indegree.get(next) - 1);
      if (indegree.get(next) === 0) order.push(next);
    }
  }
  return order.length === edges.size ? order.join('') : '';
}

// Accepts any letter order consistent with the sorted word list, or "" exactly when
// no such order exists. Validates the output against the raw words only.
export default function check(input, output) {
  const [words] = input;
  if (typeof output !== 'string') return false;

  const letters = new Set();
  for (const word of words) for (const ch of word) letters.add(ch);

  // Collect the ordering rules; a longer word before its own prefix is invalid.
  const rules = [];
  let invalid = false;
  for (let i = 0; i + 1 < words.length && !invalid; i++) {
    const a = words[i];
    const b = words[i + 1];
    let j = 0;
    while (j < a.length && j < b.length && a[j] === b[j]) j++;
    if (j < a.length && j < b.length) rules.push([a[j], b[j]]);
    else if (a.length > b.length) invalid = true;
  }

  // Independently detect a cycle among the rules (repeatedly strip letters with no
  // incoming rule).
  if (!invalid) {
    const remaining = new Set(letters);
    let changed = true;
    while (changed) {
      changed = false;
      for (const ch of remaining) {
        if (!rules.some(([from, to]) => to === ch && remaining.has(from))) {
          remaining.delete(ch);
          changed = true;
        }
      }
    }
    if (remaining.size) invalid = true;
  }

  if (invalid) return output === '';

  // Exactly the set of letters in the words, each once ...
  const chars = [...output];
  if (chars.length !== letters.size || new Set(chars).size !== chars.length) return false;
  if (!chars.every((ch) => letters.has(ch))) return false;
  // ... and every rule respected.
  const rank = new Map(chars.map((ch, i) => [ch, i]));
  return rules.every(([from, to]) => rank.get(from) < rank.get(to));
}

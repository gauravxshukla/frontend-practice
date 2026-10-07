/**
 * @param {...any} items
 * @return {any[]}
 */
export default function myConcat(...items) {
  const result = [];
  let n = 0;

  for (const item of [this, ...items]) {
    if (Array.isArray(item)) {
      for (let i = 0; i < item.length; i++, n++) {
        // Skip the assignment (but still advance n) so holes stay holes.
        if (i in item) result[n] = item[i];
      }
    } else {
      result[n++] = item;
    }
  }

  result.length = n; // keeps trailing holes
  return result;
}

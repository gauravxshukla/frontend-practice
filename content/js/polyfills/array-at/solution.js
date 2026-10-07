/**
 * @param {number} index
 * @return {any}
 */
export default function myAt(index) {
  const len = this.length;
  // ToIntegerOrInfinity: NaN → 0, truncate toward zero, keep ±Infinity.
  const n = Math.trunc(Number(index)) || 0;
  const k = n >= 0 ? n : len + n;
  if (k < 0 || k >= len) return undefined;
  return this[k];
}

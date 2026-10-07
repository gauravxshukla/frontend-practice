/**
 * @param {number} [start=0]
 * @param {number} [end]
 * @param {number} [step]
 * @return {Array<number>}
 */
export default function range(start = 0, end, step) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  if (step === undefined) {
    step = start < end ? 1 : -1;
  }

  // A zero step still yields one entry per unit of distance (lodash behaviour).
  const length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
  return Array.from({ length }, (_, i) => start + i * step);
}

/**
 * @param {any} valueA
 * @param {any} valueB
 * @return {boolean}
 */
export default function deepEqual(valueA, valueB) {
  if (valueA === valueB) return true;

  const bothObjects =
    typeof valueA === 'object' && valueA !== null && typeof valueB === 'object' && valueB !== null;
  if (!bothObjects) return false;

  if (Array.isArray(valueA) !== Array.isArray(valueB)) return false;

  const keysA = Object.keys(valueA);
  const keysB = Object.keys(valueB);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => Object.hasOwn(valueB, key) && deepEqual(valueA[key], valueB[key]));
}

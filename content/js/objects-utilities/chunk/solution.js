/**
 * @template T
 * @param {Array<T>} array
 * @param {number} [size=1]
 * @return {Array<Array<T>>}
 */
export default function chunk(array, size = 1) {
  const step = Math.floor(size);
  if (!(step >= 1)) return [];

  const result = [];
  for (let i = 0; i < array.length; i += step) {
    result.push(array.slice(i, i + step));
  }
  return result;
}

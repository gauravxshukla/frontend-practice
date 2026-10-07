/**
 * @param {string[]} items
 * @param {{ sorted?: boolean, length?: number, unique?: boolean }} [options]
 * @return {string}
 */
export default function listFormat(items, options = {}) {
  let list = items.filter((item) => item !== '');
  if (options.unique) list = [...new Set(list)];
  if (options.sorted) list.sort();

  const { length } = options;
  if (length > 0 && length < list.length) {
    const hidden = list.length - length;
    return `${list.slice(0, length).join(', ')} and ${hidden} ${hidden === 1 ? 'other' : 'others'}`;
  }

  if (list.length <= 1) return list.join('');
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
}

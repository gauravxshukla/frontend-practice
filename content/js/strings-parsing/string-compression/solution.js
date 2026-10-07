/**
 * Run-length encoding.
 * encode('aaabccdddd') === 'a3bc2d4'; decode('a3bc2d4') === 'aaabccdddd'
 */
export default {
  /**
   * @param {string} str
   * @return {string}
   */
  encode(str) {
    const parts = [];
    let i = 0;
    while (i < str.length) {
      let j = i;
      while (j < str.length && str[j] === str[i]) j++;
      const count = j - i;
      parts.push(count > 1 ? `${str[i]}${count}` : str[i]);
      i = j;
    }
    return parts.join('');
  },

  /**
   * @param {string} str
   * @return {string}
   */
  decode(str) {
    // A non-digit, then an optional multi-digit count.
    return str.replace(/(\D)(\d*)/g, (_, char, count) => char.repeat(count ? Number(count) : 1));
  },
};

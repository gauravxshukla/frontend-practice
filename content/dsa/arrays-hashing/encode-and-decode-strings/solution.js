/**
 * @param {string[]} strs
 * @return {string}
 */
function encode(strs) {
  let out = '';
  // the length says where each string ends, so its content can contain anything
  for (const s of strs) out += s.length + '#' + s;
  return out;
}

/**
 * @param {string} encoded
 * @return {string[]}
 */
function decode(encoded) {
  const result = [];
  let i = 0;
  while (i < encoded.length) {
    // the digits before '#' are the length of the next string
    let j = i;
    while (encoded[j] !== '#') j++;
    const length = Number(encoded.slice(i, j));
    // take exactly that many characters, even if they include '#' or digits
    result.push(encoded.slice(j + 1, j + 1 + length));
    i = j + 1 + length;
  }
  return result;
}

export default { encode, decode };

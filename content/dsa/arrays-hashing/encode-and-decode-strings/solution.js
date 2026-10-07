/**
 * Length-prefix encoding: each string becomes `<length>#<string>`.
 * The decoder reads digits up to '#', then takes exactly `length` characters,
 * so any character (including '#' and digits) is safe inside a string.
 * @param {string[]} strs
 * @return {string}
 */
function encode(strs) {
  let out = '';
  for (const s of strs) out += `${s.length}#${s}`;
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
    let j = i;
    while (encoded[j] !== '#') j++;
    const length = Number(encoded.slice(i, j));
    result.push(encoded.slice(j + 1, j + 1 + length));
    i = j + 1 + length;
  }
  return result;
}

export default { encode, decode };

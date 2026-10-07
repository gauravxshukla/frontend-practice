/**
 * @param {...*} values
 * @return {() => *}
 */
export default function cycle(...values) {
  let index = 0;

  return function () {
    const value = values[index];
    index = (index + 1) % values.length;
    return value;
  };
}

const isPlainObject = (value) => {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * @param {...*} args strings, numbers, objects and arrays of these
 * @return {string}
 */
export default function classNames(...args) {
  const classes = [];

  const collect = (value) => {
    if (!value) return;
    if (typeof value === 'string' || typeof value === 'number') {
      classes.push(value);
    } else if (Array.isArray(value)) {
      value.forEach(collect);
    } else if (typeof value === 'object' && isPlainObject(value)) {
      for (const key of Object.keys(value)) {
        if (value[key]) classes.push(key);
      }
    }
  };

  args.forEach(collect);
  return classes.join(' ');
}

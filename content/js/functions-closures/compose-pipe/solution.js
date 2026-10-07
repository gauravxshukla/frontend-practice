/**
 * @param {...Function} fns
 * @return {Function}
 */
export default function pipe(...fns) {
  return function (...args) {
    if (fns.length === 0) return args[0];
    const [first, ...rest] = fns;
    return rest.reduce((acc, fn) => fn(acc), first.apply(this, args));
  };
}

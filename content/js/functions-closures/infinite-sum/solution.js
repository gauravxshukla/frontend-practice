const add = (numbers) => numbers.reduce((total, n) => total + n, 0);

/**
 * @param {...number} args
 * @return {Function | number}
 */
export default function sum(...args) {
  if (args.length === 0) return 0;
  const total = add(args);

  // Each call starts a fresh chain, so intermediates can be reused safely.
  return function next(...more) {
    return more.length === 0 ? total : sum(total + add(more));
  };
}

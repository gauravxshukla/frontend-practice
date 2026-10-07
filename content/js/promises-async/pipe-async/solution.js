/**
 * @param {...Function} fns
 * @return {(input: any) => Promise<any>}
 */
export default function pipeAsync(...fns) {
  return async (input) => {
    let acc = input;
    for (const fn of fns) acc = await fn(acc);
    return acc;
  };
}

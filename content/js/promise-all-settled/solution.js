/**
 * @param {Array} iterable
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
export default function promiseAllSettled(iterable) {
  return new Promise((resolve) => {
    const results = new Array(iterable.length);
    let pending = iterable.length;

    if (pending === 0) {
      resolve(results);
      return;
    }

    iterable.forEach(async (item, index) => {
      try {
        results[index] = { status: 'fulfilled', value: await item };
      } catch (e) {
        results[index] = { status: 'rejected', reason: e };
      }

      pending -= 1;
      if (pending === 0) resolve(results);
    });
  });
}

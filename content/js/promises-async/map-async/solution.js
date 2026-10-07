/**
 * @param {Array<any>} iterable
 * @param {(value: any) => Promise<any>} callbackFn
 * @return {Promise<Array<any>>}
 */
export default function mapAsync(iterable, callbackFn) {
  return new Promise((resolve, reject) => {
    const results = new Array(iterable.length);
    let pending = iterable.length;

    if (pending === 0) {
      resolve(results);
      return;
    }

    iterable.forEach(async (currentEl, index) => {
      try {
        results[index] = await callbackFn(currentEl);
        pending -= 1;
        if (pending === 0) resolve(results);
      } catch (e) {
        reject(e);
      }
    });
  });
}

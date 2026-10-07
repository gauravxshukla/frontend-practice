/**
 * @param {Array<any>} items
 * @param {number} limit
 * @param {(item: any, index: number) => Promise<any>} asyncFn
 * @return {Promise<Array<any>>}
 */
export default function mapAsyncLimit(items, limit, asyncFn) {
  return new Promise((resolve, reject) => {
    const results = new Array(items.length);
    let nextIndex = 0;
    let completed = 0;
    let failed = false;

    if (items.length === 0) {
      resolve(results);
      return;
    }

    const launch = () => {
      if (failed || nextIndex >= items.length) return;
      const index = nextIndex++;
      // Wrapping in then() turns a sync throw from asyncFn into a rejection.
      Promise.resolve()
        .then(() => asyncFn(items[index], index))
        .then(
          (value) => {
            results[index] = value;
            completed += 1;
            if (completed === items.length) resolve(results);
            else launch();
          },
          (error) => {
            failed = true;
            reject(error);
          },
        );
    };

    for (let i = 0; i < Math.min(limit, items.length); i++) launch();
  });
}

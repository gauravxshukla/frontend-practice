
// Debounce, Throttle, Promise.any, Promise.merge, Promise.allSettled, Promise.all, Promisify, Map async

export function promiseAll(iterable) {
    return new Promise((resolve, reject) => {
        let resultPromise = new Array(iterable.length);
        let unresolved = iterable.length;

        if(unresolved === 0 ){
            resolve(resultPromise);
        }

        iterable.map(async (currentPromise, index) => {
            try {
                let currentPromiseResponse = await currentPromise;
                resultPromise[index] = currentPromiseResponse;
                unresolved -=1;

                if(unresolved === 0){
                    resolve(resultPromise);
                }
            }
            catch(e){
                reject(e);
            }
        })
    });
}

export function promiseAllSettled(iterable) {
    return new Promise((resolve, reject) => {
        let resultPromise = new Array(iterable.length);
        let pendingPromise = iterable.length;

        if(pendingPromise === 0 ){
            resolve(resultPromise);
        }

        iterable.map( async (currentPromise, index) => {
            try {
                let currentPromiseResponse = await currentPromise;
                resultPromise[index] = { status: 'fulfilled', value: currentPromiseResponse };
                pendingPromise -=1;
            }
            catch(e){
                resultPromise[index] = { status: 'rejected', reason: e };
                pendingPromise -=1;
            }

            if(pendingPromise === 0){
                resolve(resultPromise);
            }
        });
    });
}

export function promiseWithResolvers() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    })

    return {promise, resolve, reject};
}

export function debounce(func, wait) {
    let timerId = null;
    return function debounced(...args){
        let context = this;
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.call(context, ...args);
        }, wait);
    }
}

export function throttle(func, wait) {
    let shouldThrottle = true;
    return function throttled(...args){
        if(shouldThrottle){
            func.call(this, ...args);
            shouldThrottle = false;
        }

        setTimeout(() => {
            shouldThrottle = true;
        }, wait);
    };
}

export function mapAsync(iterable, callbackFn){
  return new Promise((resolve, reject) => {
    let len = iterable.length;
    let array = new Array(len);

    if (len === 0) {
      resolve(array);
    }

    iterable.map(async (currentEl, index) => {
      try {
        if (Object.hasOwn(iterable, index)) {
          array[index] = await callbackFn.call(this, currentEl);
        }
        if (index === len - 1) {
          resolve(array);
        }
      } catch (e) {
        reject(e);
      }
    });
  });
}

export function promiseRace(){
    return 'Promise.race';
}
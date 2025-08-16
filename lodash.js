
// deepClone, deepEqual, IntersectionBy, IntersectionWith, isEmpty


export function flattenArray(inputArr) {
    let result = [];
    const copyArr = [...inputArr];

    while(copyArr.length){
        let currentItem = copyArr.shift();

        if(Array.isArray(currentItem)){
            copyArr.unshift(...currentItem);
        }
        else{
            result.push(currentItem);
        }
    }
    return result;
}

export function countBy(arr, iteratee) {
    let result = {};

    arr.map((currentItem) => {
        let currentResult = iteratee.call(this, currentItem);
        if(Object.hasOwn(result,currentResult)){
            result[currentResult] +=1;
        }
        else{
            result[currentResult] = 1;
        }
    });

    return result;
}

export function groupBy(arr, iteratee){
    let result = {};

    arr.map((currentItem) => {
        let currentResult = iteratee.call(this, currentItem);
        if(Object.hasOwn(result, currentResult)){
            result[currentResult].push(currentItem);
        }
        else{
            result[currentResult] = [currentItem];
        }
    });
    return result;
}

export function limit(func, n) {
    let count = n, oldResult= null;
    return function limited(...args){
        if(count > 0){
            count -=1;
            oldResult = func.apply(this, args);
        }

        return oldResult;
    }
}

export function curry(func) {
    return function curried(...args){
        if(args.length >= func.length){
            return func.apply(this, args);
        }

        return function (...nextArgs){
            return curried.apply(this, [...args, ...nextArgs]);
        }
    }
}

export function deepClone(value) {
    if(typeof value !== 'object' || typeof value === null){
        return value;
    }

    if(Array.isArray(value)){
        return value.map((currentItem) => deepClone(currentItem));
    }

    return Object.fromEntries(Object.entries(value).map(([ key, value]) => [key, deepClone(value)]));
}

export function deepEqual() {
    
}
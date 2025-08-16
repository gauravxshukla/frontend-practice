
// Filter, map, reduce, .call, .apply, .bind, eventEmitter, JSON.stringify, type utilities.


export function myFilter(callbackFn, thisArg) {
    const arrLength = this.length;
    const result = [];

    for(let i=0;i<arrLength;i++){
        const currentValue = this[i];
        if(Object.hasOwn(this, i) && callbackFn.call(thisArg, currentValue, i, this) ){
            result.push(currentValue);
        }
    }
    return result;
}

export function myMap(callbackFn, thisArg){
    const arrLength = this.length;
    const result = [];

    for(let i=0; i< arrLength; i++){
        const currentValue = this[i];
        if(Object.hasOwn(this, i)){
            result[i] = callbackFn.call(thisArg, currentValue, i, this);
        }
    }
    return result;
}


export function pairSum(numbers, target) {
  let hashMap = {};
  
  for(let i=0;i<numbers.length;i++){
    if(hashMap.hasOwnProperty(target - numbers[i])){
      return [hashMap[target-numbers[i]], i];
    }
    else{
      hashMap[numbers[i]] = i;
    }
  }
};

export function isBalancedBrackets(str) {
  let currentStack = [];
  let stringLength = str.length;

  for(let i = 0; i < stringLength ; i++){
    if(str[i] === '(' || str[i] === '[' || str[i] === '{' ){
      currentStack.push(str[i]);
    }
    else{
      if(str[i] === ')' && currentStack[currentStack.length-1] === '(' ){
        currentStack.pop();
      }
      else if(str[i] === ']' && currentStack[currentStack.length-1] === '[' ){
        currentStack.pop();
      }
      else if(str[i] === '}' && currentStack[currentStack.length-1] === '{' ){
        currentStack.pop();
      }
      else{
        currentStack.push(str[i]);
      }
    }
  }
  return !currentStack.length;
}

export function findDuplicates(numbers) {
  let hashMap = {};
  let arrLength = numbers.length;

  for(let i=0; i< arrLength; i++){
    if(hashMap.hasOwnProperty(numbers[i])){
      return true;
    }
    else{
      hashMap[numbers[i]] = 1;
    }
  }
  return false;
}

export function maxProfit(prices) {
    let minBuyPrice = Infinity;
    let maxProfit = 0;

    for(let i=0;i<prices.length; i++){
      if(minBuyPrice > prices[i]){
        minBuyPrice = prices[i];
      }
      else{
        maxProfit = Math.max(maxProfit, prices[i] - minBuyPrice);
      }
    }

    return maxProfit;
}


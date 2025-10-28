# JavaScript Interview Questions — Quick Revision

### 1. What is Hoisting
Hoisting means JavaScript moves variable and function declarations to the top of their scope before code execution.

**Edge case:** Only declarations are hoisted, not initializations; `let` and `const` are hoisted but stay in the Temporal Dead Zone until initialized.

---
### 2. Difference between Function Scope and Global Scope
**Global scope:** Accessible from anywhere in the code.

**Function scope:** Accessible only within the function it’s declared in.

**Edge case:** Variables declared with `var` inside a function can shadow global variables with the same name.

---
### 3. Difference between Shallow Copy and Deep Copy
A shallow copy creates a new object but only copies references of nested objects — not the actual nested data.
A deep copy recursively copies all levels of the object, ensuring that every nested structure is fully cloned.

---
### 4. What is the Difference Between call, apply, and bind
**.call:** Calls function with a given `this` and arguments individually.
**.apply:** Same as call, but arguments are in an array.
**.bind:** Returns a new function with bound `this`.
**Edge case:** `.bind()` doesn’t immediately invoke the function — it must be called later.

---
### 5. Difference between slice and splice method for array
**slice:** Returns a new array (doesn’t modify the original).
**splice:** Changes the original array (add/remove items).
**Edge case:** `splice` returns the deleted elements, not the modified array.

---
### 6. What is a Currying Function? Explain with an Example
Currying converts a multi-argument function into a series of single-argument functions.
```javascript
function add(a) {
  return function (b) {
    return a + b;
  };
}
console.log(add(5)(10)); // 15
```
**Edge case:** If any argument is missing, the returned function must handle it gracefully or throw an error.

---
### 7. What is a Pure Function? Benefits of Pure Function
A pure function returns the same output for the same input and has no side effects.
**Benefits:** Easier to test, debug, and cache.
**Edge case:** If a function modifies external variables or DOM, it’s not pure even if output seems predictable.

---
### 8. What is Closure? Explain with an Example
A closure gives access to an outer function’s scope from an inner function even after the outer function has executed.
```javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}
const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
```
**Edge case:** Closures can cause memory leaks if large objects remain referenced unintentionally.

---
### 9. What is the Temporal Dead Zone
It’s the phase between variable declaration and initialization where `let` and `const` can’t be accessed.
**Edge case:** Accessing variables before initialization throws a ReferenceError, not undefined.

---
### 10. What is an IIFE (Immediately Invoked Function Expression)
IIFE runs immediately after it’s defined.
```javascript
(function () {
  console.log("IIFE runs immediately!");
})();
```
**Edge case:** Must be wrapped in parentheses to avoid syntax errors.

---
### 11. What is a Callback Function? Explain Callback Hell
A callback function is a function passed into another function as an argument. Callback Hell is an anti-pattern with multiple nested callbacks which makes code hard to read and debug.

---
### 12. Explain Throttle and Debounce
**Debouncing:** Executes a function only after a certain time since the last call.
```javascript
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```
**Throttling:** Ensures a function executes at most once in a specific interval.
```javascript
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

---
### 13. Explain the Difference Between let, const and var
| Keyword | Scope | Redeclaration | Reassignment | Hoisting |
|----------|--------|----------------|----------------|-----------|
| **var** | Function | ✅ Yes | ✅ Yes | Hoisted (initialized as `undefined`) |
| **let** | Block | ❌ No | ✅ Yes | Hoisted but in TDZ |
| **const** | Block | ❌ No | ❌ No | Hoisted but in TDZ |
**Edge case:** Objects declared with `const` can still have their properties mutated.

---
### 14. Explain difference between undefined, null and NaN
- **undefined:** A variable declared but not assigned.
- **null:** Explicitly assigned value representing “no value”.
- **NaN:** Result of invalid mathematical operations.
**Edge case:** `typeof null` returns `"object"` (a historical bug).

---
### 15. What is a Promise? Explain different states of a promise
A Promise represents the eventual completion (or failure) of an asynchronous operation.
States: **pending**, **fulfilled**, **rejected**.

---
### 16. What is Promise Chaining
Promise chaining allows sequential asynchronous execution.
```javascript
fetchData()
  .then(processData)
  .then(displayData)
  .catch(handleError);
```

---
### 17. Explain all Promise functions
- **Promise.all:** Waits for all promises; rejects if any fail.
- **Promise.race:** Resolves/rejects as soon as one settles.
- **Promise.allSettled:** Waits for all promises regardless of success or failure.
- **Promise.any:** Resolves when the first promise fulfills.

---
### 18. Explain Event loop, Call Stack, Macro task queue and Micro task queue
- **Call Stack:** Executes synchronous code.
- **Event Loop:** Pushes queued tasks when stack is empty.
- **Macro Task Queue:** Holds `setTimeout`, `setInterval`.
- **Micro Task Queue:** Holds Promises and executes before macro tasks.

---
### 19. What is Lexical Scope? Explain AST
**Lexical Scope:** Variable access is determined by where functions are defined.
**AST:** Abstract Syntax Tree — structural representation of code.

---
### 20. Phases of Execution Context
1. **Creation Phase:** Memory allocation, hoisting.
2. **Execution Phase:** Code runs line by line.
**Global Execution Context:** Created first.
**Function Execution Context:** Created whenever a function runs.

---
### 21. Difference between Spread and Rest parameter
- **Spread (`...`):** Expands elements.
- **Rest (`...`):** Collects elements into an array.
```javascript
const arr = [1, 2, 3];
console.log(...arr);
function sum(...nums) { return nums.reduce((a, b) => a + b); }
console.log(sum(1, 2, 3));
```

---
### 22. Difference between forEach and Map function
- **forEach:** Iterates but returns nothing.
- **map:** Returns a new array.
**Edge case:** `forEach` can’t be chained; `map` can.

---
### 23. What is a Polyfill
Polyfills add missing functionality to older browsers.
```javascript
if (!Array.prototype.includes) {
  Array.prototype.includes = function (value) {
    return this.indexOf(value) !== -1;
  };
}
```

---
### 24. Explain setTimeout, setInterval, clearTimeout, clearInterval
```javascript
const id = setInterval(() => console.log("Ping"), 1000);
setTimeout(() => clearInterval(id), 5000);
```

---
### 25. Explain Prototype Chain
Every object has a `[[Prototype]]` link forming a chain up to `Object.prototype`.
```javascript
const obj = {};
console.log(obj.__proto__ === Object.prototype); // true
```
**Edge case:** Property not found → JS searches prototype chain.

---
### 26. What is Memoization
Memoization caches previous results to speed up repeated calls.
```javascript
const memoizeAddition = () => {
  let cache = {};
  return (value) => {
    if (value in cache) return cache[value];
    let result = value + 20;
    cache[value] = result;
    return result;
  };
};
```
```javascript
const add = memoizeAddition();
console.log(add(20));
console.log(add(20));
```

---
### 27. What is Hoisting (Detailed)
Hoisting moves variable and function declarations to the top of their scope.
```javascript
console.log(msg); // undefined
var msg = "Hoisted!";
```
Interpreted as:
```javascript
var msg;
console.log(msg);
msg = "Hoisted!";
```

---
### 28. What are Classes in ES6
Classes are syntactic sugar over prototype-based inheritance.
```javascript
class Bike {
  constructor(model, color) {
    this.model = model;
    this.color = color;
  }
  getDetails() {
    return this.model + " bike has " + this.color + " color";
  }
}
```

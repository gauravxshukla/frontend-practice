🧠 JavaScript Interview Questions — Quick Revision
01) What is Hoisting?

Hoisting means JavaScript moves variable and function declarations to the top of their scope before code execution.

Edge case:
Only declarations are hoisted, not initializations; let and const are hoisted but stay in the Temporal Dead Zone until initialized.

02) Difference between Function Scope and Global Scope

Global scope: Accessible from anywhere in the code.
Function scope: Accessible only within the function it’s declared in.

Edge case:
Variables declared with var inside a function can shadow global variables with the same name.

03) Difference between Shallow Copy and Deep Copy

A shallow copy creates a new object but only copies the references of nested objects — not the actual nested data. So, if the original object has another object or array inside it, both the original and copied object will point to the same memory location for those nested values. Hence, changes to nested objects reflect in both copies.

A deep copy, on the other hand, recursively copies all levels of the object, ensuring that every nested structure is fully cloned. The new object is completely independent — modifying one will not affect the other.

04) Difference Between call, apply, and bind

.call: Calls function with a given this and arguments individually.
.apply: Same as call, but arguments are in an array.
.bind: Returns a new function with bound this.

Edge case:
bind() doesn’t immediately invoke the function — it must be called later.

05) Difference Between slice and splice Method for Array

slice: Returns a new array (doesn’t modify the original).
splice: Changes the original array (adds/removes items).

Edge case:
splice returns the deleted elements, not the modified array.

06) What is a Currying Function? Explain with an Example

Currying converts a multi-argument function into a series of single-argument functions.

Edge case:
If any argument is missing, the returned function must handle it gracefully or throw an error.

07) What is a Pure Function? Benefits of Pure Function

A pure function returns the same output for the same input and has no side effects.

Benefits: Easier to test, debug, and cache.
Edge case: If a function modifies external variables or DOM, it’s not pure even if output seems predictable.

08) What is a Closure? Explain with an Example

A closure gives access to an outer function’s scope from an inner function even after the outer function has executed.

Edge case:
Closures can cause memory leaks if large objects remain referenced unintentionally.

09) What is the Temporal Dead Zone (TDZ)?

It’s the phase between variable declaration and initialization where let and const can’t be accessed.

Edge case:
Accessing variables before initialization throws a ReferenceError, not undefined.

10) What is an IIFE (Immediately Invoked Function Expression)?

IIFE runs immediately after it’s defined and helps create a private scope.

Edge case:
Must be wrapped in parentheses to avoid syntax errors.

11) What is a Callback Function? Explain Callback Hell

A callback function is a function passed into another function as an argument. This function is invoked inside the outer function to complete an action.

Callback Hell is an anti-pattern with multiple nested callbacks which makes code hard to read and debug when dealing with asynchronous logic.

12) Explain Throttle and Debounce (With Examples)

Debouncing: Ensures a function is executed only after a certain time has passed since the last invocation (e.g., waiting for user to stop typing before fetching results).

Throttling: Ensures a function executes at most once in a specific interval (e.g., limiting scroll event handlers or API calls).

13) Explain the Difference Between let, const, and var

var: Function-scoped, hoisted, can be redeclared and updated.

let: Block-scoped, hoisted but in the Temporal Dead Zone, can be updated but not redeclared.

const: Block-scoped, hoisted but in the Temporal Dead Zone, cannot be redeclared or reassigned.

Edge case:
Objects declared with const can still have their properties mutated.

14) Explain the Difference Between undefined, null, and NaN

undefined: A variable that has been declared but not assigned a value.

null: Explicitly assigned value representing “no value”.

NaN: Stands for “Not-a-Number”, a result of invalid mathematical operations.

Edge case:
typeof null returns "object" (a historical bug).

15) What is a Promise? Explain Different States of a Promise

A Promise represents the eventual completion (or failure) of an asynchronous operation.

States:

pending: Initial state.

fulfilled: Operation completed successfully.

rejected: Operation failed (e.g., network error).

16) What is Promise Chaining?

Promise chaining allows you to execute asynchronous tasks sequentially by returning a new promise in each .then() block.

Example:

fetchData()
  .then(processData)
  .then(displayData)
  .catch(handleError);

17) Explain All Promise Functions

Promise.all: Waits for all promises to resolve; rejects if any one fails.

Promise.race: Resolves or rejects as soon as one promise settles.

Promise.allSettled: Waits for all promises to finish, regardless of success or failure.

Promise.any: Resolves when the first promise fulfills (ignores rejections).

18) Explain Event Loop, Call Stack, Macro Task Queue, and Micro Task Queue

Call Stack: Executes synchronous code line by line.

Event Loop: Monitors the stack and pushes queued tasks when stack is empty.

Macro Task Queue: Holds tasks like setTimeout, setInterval, and I/O.

Micro Task Queue: Holds tasks like Promises and process.nextTick; executed before macro tasks.

19) What is Lexical Scope? Explain AST

Lexical Scope: Determines variable access based on where functions are defined, not where they are called.
AST (Abstract Syntax Tree): A tree-like representation of code structure used by compilers/interpreters to analyze and execute code.

20) Phases of Execution Context — Global and Function Context

JavaScript executes code in two phases:

Creation Phase: Memory is allocated for variables and functions (hoisting).

Execution Phase: Code runs line by line.

Global Execution Context: Created when the script starts.
Function Execution Context: Created whenever a function is invoked.

21) Difference Between Spread and Rest Parameter

Spread (...): Expands elements from an array or object.

Rest (...): Collects multiple elements into an array (used in function parameters).

Example:

const arr = [1, 2, 3];
console.log(...arr); // Spread

function sum(...nums) { return nums.reduce((a, b) => a + b); } // Rest

22) Difference Between forEach and map Function

forEach: Iterates over elements but doesn’t return a new array.

map: Creates and returns a new array with transformed elements.

Edge case:
forEach cannot be chained, while map can.

23) What is a Polyfill?

A polyfill is a piece of code (usually JS) that implements modern functionality on older browsers that do not natively support it.

Example:
Manually defining Array.prototype.includes if not available.

24) Explain setTimeout, setInterval, and Their Clear Methods

setTimeout: Executes a function once after a delay.

setInterval: Repeatedly executes a function at fixed intervals.

clearTimeout: Cancels a timeout.

clearInterval: Stops the repeating interval.

25) Explain Prototype Chain

Every JavaScript object has an internal link ([[Prototype]]) to another object. This chain continues until it reaches Object.prototype, forming the prototype chain.

Edge case:
Accessing a property not found in the object looks up the prototype chain until found or returns undefined.
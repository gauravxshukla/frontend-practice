
Questions to prepare before every interview

01) What is Hoisting?
-> Hoisting means JavaScript moves variable and function declarations to the top of their scope before code execution.

   Edge case:
   Only declarations are hoisted, not initializations; let and const are hoisted but stay in the Temporal Dead Zone until initialized.

02) Difference between function scope, global scope?
-> Global scope: Accessible from anywhere in the code.

   Function scope: Accessible only within the function it’s declared in.
   Edge case:
   Variables declared with var inside a function can shadow global variables with the same name.

03) Difference between shallow copy and Deep copy?
-> A shallow copy creates a new object but only copies the references of nested objects — not the actual nested data. So, if the original object has another object or array inside it, both the original and copied object will point to the same memory location for those nested values.
Hence, changes to nested objects reflect in both copies.

A deep copy, on the other hand, recursively copies all levels of the object, ensuring that every nested structure is fully cloned. The new object is completely independent — modifying one will not affect the other.

04) What is the Difference Between call, apply, and bind?
-> .call: Calls function with a given this and arguments individually.

   .apply: Same as call, but arguments are in an array.

   .bind: Returns a new function with bound this.
   Edge case:
   .bind() doesn’t immediately invoke the function — it must be called later.

05) Difference between slice and splice method for array?
-> slice: Returns a new array (doesn’t modify original).

   splice: Changes the original array (add/remove items).
   
   Edge case:
   splice returns the deleted elements, not the modified array.

06) What is the currying function? Explain with an example?
-> Currying converts a multi-argument function into a series of single-argument functions.
   Edge case:
   If any argument is missing, the returned function must handle it gracefully or throw an error.

07) What is a pure function? Benefits of pure function?
-> A pure function returns the same output for the same input and has no side effects.
   Benefits: Easier to test, debug, and cache.
   Edge case:
   If a function modifies external variables or DOM, it’s not pure even if output seems predictable.

08) What is Closure? Explain with an example?
-> A closure gives access to an outer function’s scope from an inner function even after the outer function has executed.

   Edge case:
   Closures can cause memory leaks if large objects remain referenced unintentionally.

09) What is the Temporal Dead Zone?
-> It’s the phase between variable declaration and initialization where let and const can’t be accessed.
   Edge case:
   Accessing variables before initialization throws a ReferenceError, not undefined.

10)	What is an IIFE (Immediately Invoked Function Expression)?
-> IIFE (Immediately Invoked Function Expression) runs right after it’s defined.

   Edge case:
   Must be wrapped in parentheses to avoid syntax errors.

11) What is a callback function? Explain callback hell?
-> A callback function is a function passed into another function as an argument. This function is invoked inside the outer function to complete an action.

Callback Hell is an anti-pattern with multiple nested callbacks which makes code hard to read and debug when dealing with asynchronous logic. The callback hell looks like below,

12) Explain Throttle and Debounce? Explain with examples?
-> 
   Debouncing is a programming technique used to limit how often a function is executed. 
   Specifically, it ensures that a function is only triggered after a certain amount of time has passed since it was last invoked. This prevents unnecessary or excessive function calls, which can help optimize performance and reduce unnecessary CPU usage or API requests.

   For example, when a user types in a search box, you typically want to wait until they’ve finished typing before fetching suggestions. Without debouncing, an API call would be triggered on every keystroke, potentially causing performance issues. With debouncing, the function call is postponed until the user stops typing for a specified period (e.g., 300ms). If the user types again before this time elapses, the timer resets.

   Throttling is a programming technique used to control the rate at which a function is executed. When an event is triggered continuously—such as during window resizing, scrolling, or mouse movement—throttling ensures that the associated event handler is not called more often than a specified interval. This helps improve performance by reducing the number of expensive function calls and preventing performance bottlenecks.

   Common use cases:
   Window resize events
   Scroll events
   Mouse movement or drag events
   API rate limiting
   How does throttling work?
   Throttling will execute the function at most once every specified time interval, ignoring additional calls until the interval has passed.


13) Explain the difference between let, const and var?
-> 

14) Explain difference between undefined and null and NaN?
-> 

15) What is a promise? Explain different states of a promise?
->    
   A Promise is a JavaScript object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It acts as a placeholder for a value that may not be available yet but will be resolved in the future.

   A Promise can be in one of three states:

   pending: Initial state, neither fulfilled nor rejected.
   fulfilled: The operation completed successfully.
   rejected: The operation failed (e.g., due to a network error).

16) What is promise chaining?
-> 

17) Explain all promise functions? (Promise.all, Promise.race,)
-> 

18) Explain Event loop, Call Stack, Macro task queue and Micro task queue?
-> 

19) What is Lexical Scope?Explain AST?
-> 

20) Phases of Execution Context? Explain Global and Function Execution Context?
-> 

21) Difference between Spread and Rest parameter?
-> 

22) Difference between forEach and Map function?
-> 

23) What is a polyfill?
-> 

24) Explain setTimeout, setInterval, also explain the use of clearTimeout and clearInterval?
-> 

25) Explain prototype Chain?
-> 

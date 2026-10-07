# JavaScript Output: Scope, Hoisting and Closures

Predict what each snippet logs. These cards cover what hoisting actually creates, the temporal dead zone (TDZ), how nested blocks and functions resolve names, and how closures capture variables rather than values. Assume every snippet runs as an ES module: strict mode, with its own module scope instead of the global scope. Block-level function declarations are left out on purpose, because their behaviour has historically varied between engines and modes.

---

## 1. Function vs `var` with the same name

```js
function demo() {
  console.log(typeof value);
  var value = 'string now';
  function value() {}
  console.log(typeof value);
}
demo();
```

**Output**

```
function
string
```

**Why**

- Both declarations are hoisted. The `var` creates the binding, and the function declaration initialises it with the function before the body runs.
- The `var` initialiser is an ordinary assignment, and it runs when execution reaches that line.

**Variant:** Remove `= 'string now'`. Both logs then say `function`.

---

## 2. Duplicate function declarations

```js
function outer() {
  console.log(greet());
  function greet() { return 'first'; }
  var greet;
  console.log(greet());
  function greet() { return 'second'; }
}
outer();
```

**Output**

```
second
second
```

**Why**

- All function declarations are hoisted before the body runs, and the last one for a given name wins.
- A `var` with no initialiser doesn't reset an existing binding.
- At module top level this would be a `SyntaxError`, because declarations there behave like `let`.

**Variant:** Change `var greet;` to `var greet = () => 'third';`.

---

## 3. `typeof` and the TDZ

```js
console.log(typeof notDeclaredAnywhere);
try {
  console.log(typeof later);
} catch (e) {
  console.log(`${e.name}: ${e.message}`);
}
let later = 1;
```

**Output**

```
undefined
ReferenceError: Cannot access 'later' before initialization
```

**Why**

- `typeof` on a name that was never declared returns `'undefined'` without throwing.
- A `let`/`const` binding exists from the start of its scope but is uninitialised. Any access, including `typeof`, throws until the declaration runs.

**Variant:** Move the `try` block into a function that is only called after the `let` line.

---

## 4. A shadowing `const` puts the outer name in the TDZ

```js
const x = 'outer';
{
  try {
    console.log(x);
  } catch (e) {
    console.log(e.message);
  }
  const x = 'inner';
  console.log(x);
}
console.log(x);
```

**Output**

```
Cannot access 'x' before initialization
inner
outer
```

**Why**

- The inner `const x` takes over the name `x` for the whole block, including the lines above it.
- Lookup stops at the first scope that declares the name, even though that binding is still in its TDZ.

**Variant:** Change the inner `const` to `var` (and predict the `SyntaxError`).

---

## 5. Assigning through nested blocks

```js
let level = 'module';
{
  let level = 'block 1';
  {
    level = 'changed';
    const other = level;
    console.log(other);
  }
  console.log(level);
}
console.log(level);
```

**Output**

```
changed
changed
module
```

**Why**

- The innermost block declares no `level`, so the assignment resolves to the closest one, in block 1.
- The module-level `level` is shadowed, so nothing inside the outer block can reach it.

**Variant:** Add `let level;` as the first line of the innermost block.

---

## 6. Closures capture variables, not values

```js
let name = 'Ada';
const greet = () => `Hi ${name}`;
name = 'Grace';
console.log(greet());
function makePair() {
  let n = 1;
  const read = () => n;
  n = 2;
  return [read, () => n++];
}
const [read, bump] = makePair();
bump();
console.log(read());
```

**Output**

```
Hi Grace
3
```

**Why**

- A closure holds a reference to the binding itself, so it sees whatever the binding holds when it runs.
- `read` and `bump` share one `n`. It went from 2 to 3 after `makePair` returned.

**Variant:** Change `const read = () => n` to `const snapshot = n; const read = () => snapshot`.

---

## 7. Loop closures: `var`, `let` and IIFE

```js
const fromVar = [];
const fromLet = [];
const fromIife = [];
for (var i = 0; i < 3; i++) fromVar.push(() => i);
for (let j = 0; j < 3; j++) fromLet.push(() => j);
for (var k = 0; k < 3; k++) fromIife.push(((copy) => () => copy)(k));
console.log(fromVar.map((f) => f()).join());
console.log(fromLet.map((f) => f()).join());
console.log(fromIife.map((f) => f()).join());
```

**Output**

```
3,3,3
0,1,2
0,1,2
```

**Why**

- A `var` loop has a single `i` for the whole loop, so every closure sees its final value.
- A `let` loop creates a fresh binding for each iteration.
- The IIFE copies the current value into a parameter, which gives each closure its own variable.

**Variant:** Log `i` and `k` after the loops, and then try logging `j`.

---

## 8. Mutating the `let` loop variable inside the body

```js
const fns = [];
for (let i = 0; i < 6; i++) {
  fns.push(() => i);
  i++;
}
console.log(fns.map((f) => f()).join());
```

**Output**

```
1,3,5
```

**Why**

- Each iteration's binding is copied into the next one before the `i++` update runs.
- The `i++` in the body changes the current iteration's binding, which its closure captured, so every closure sees the incremented value.

**Variant:** Move `i++` above the `push`.

---

## 9. The name of a named function expression

```js
const f = function named() {
  try {
    named = 'changed';
  } catch (e) {
    console.log(`${e.name}: ${e.message}`);
  }
  return typeof named;
};
console.log(f());
console.log(typeof named);
const g = function shadow() { const shadow = 1; return shadow; };
console.log(g());
```

**Output**

```
TypeError: Assignment to constant variable.
function
undefined
1
```

**Why**

- The name lives in a small scope of its own, visible only inside the function. It is read-only, and strict mode throws when you assign to it.
- The name doesn't leak to the outer scope.
- A local declaration with the same name shadows it without error.

**Variant:** Change `const f` to `let f` and reassign `f` after the call.

---

## 10. Default parameters have their own scope

```js
const x = 'outer';
function f(getX = () => x, x = 'param') {
  var x = 'body';
  return `${getX()} / ${x}`;
}
console.log(f());
console.log(f(() => x));
```

**Output**

```
param / body
outer / body
```

**Why**

- Parameters form a scope of their own, so the default `() => x` sees the parameter `x`, not the outer one.
- When there are default expressions, the body's `var x` is a separate binding that starts as a copy of the parameter's value.
- A function passed in by the caller closes over the caller's scope instead.

**Variant:** Swap the parameter order to `(x = 'param', getX = () => x)` and call `f(undefined)`.

---

## 11. Defaults are evaluated on every call

```js
function push(item, list = []) {
  list.push(item);
  return list.length;
}
console.log(push('a'), push('b'));
let calls = 0;
function g(v = ++calls) {
  return v;
}
console.log(g(), g(10), g(), calls);
```

**Output**

```
1 1
1 10 2 2
```

**Why**

- Unlike in Python, a default expression runs again on each call that needs it, so each call gets a fresh array.
- A default is only evaluated when the argument is `undefined`. `g(10)` skips it, so `calls` doesn't go up.

**Variant:** Call `g(undefined)` and `g(null)`.

---

## 12. A counter built from a closure

```js
function makeCounter() {
  let count = 0;
  return { inc: () => ++count, get: () => count };
}
const c1 = makeCounter();
const c2 = makeCounter();
c1.inc();
c1.inc();
c2.inc();
const { inc } = c1;
inc();
console.log(c1.get(), c2.get(), c1.count);
```

**Output**

```
3 1 undefined
```

**Why**

- Each `makeCounter` call creates a new `count`, so `c1` and `c2` don't share state.
- Destructuring `inc` still works, because closures don't depend on `this`.
- `count` is private: it isn't a property of the returned object.

**Variant:** Rewrite `inc` as `inc() { return ++this.count; }` with `count` stored on the object, and destructure again.

---

## 13. Memoization through a closure

```js
function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (cache.has(n)) return `cached ${cache.get(n)}`;
    const v = fn(n);
    cache.set(n, v);
    return `computed ${v}`;
  };
}
const square = memoize((n) => n * n);
console.log(square(4));
console.log(square(4));
const square2 = memoize((n) => n * n);
console.log(square2(4));
```

**Output**

```
computed 16
cached 16
computed 16
```

**Why**

- `cache` belongs to one particular `memoize` call and outlives it, because the returned arrow keeps it alive.
- A second `memoize` call creates a separate, empty cache.

**Variant:** Call `square('4')` after `square(4)`. `Map` keys are compared with SameValueZero.

---

## 14. `const` objects are still mutable

```js
const settings = { theme: 'light' };
settings.theme = 'dark';
settings.size = 'lg';
console.log(JSON.stringify(settings));
try {
  settings = {};
} catch (e) {
  console.log(`${e.name}: ${e.message}`);
}
const list = [1];
list.push(2);
console.log(list.length);
```

**Output**

```
{"theme":"dark","size":"lg"}
TypeError: Assignment to constant variable.
2
```

**Why**

- `const` makes the binding read-only. It doesn't freeze the value it points to.
- Reassigning the name throws, but changing the object's properties or the array's contents is allowed.

**Variant:** Wrap `settings` in `Object.freeze` and repeat the property writes. In strict mode they throw.

---

## 15. Lookup in nested functions

```js
const a = 'module a';
function outer() {
  const b = 'outer b';
  function inner() {
    const a = 'inner a';
    return `${a}, ${b}, ${c}`;
  }
  const c = 'outer c';
  return inner();
}
console.log(outer());
console.log(a);
```

**Output**

```
inner a, outer b, outer c
module a
```

**Why**

- A name is resolved by walking outward from the innermost scope to the first one that declares it.
- `c` is declared after `inner`, but `inner` only runs once `c` has been initialised, so it isn't in the TDZ.

**Variant:** Move `return inner();` above the `const c` line.

---

## 16. Lexical, not dynamic, scope

```js
const value = 'lexical';
function read() {
  return value;
}
function caller() {
  const value = 'from caller';
  return read();
}
console.log(caller());
console.log([1].map(() => read())[0]);
```

**Output**

```
lexical
lexical
```

**Why**

- A function's scope chain is fixed by where it is written, not where it is called from.
- `caller`'s local `value` is invisible to `read`.

**Variant:** Define `read` inside `caller`.

---

## 17. `arguments` vs rest parameters

```js
function f(a, ...rest) {
  a = 'changed';
  return [arguments[0], arguments.length, rest.length, Array.isArray(arguments), Array.isArray(rest)].join(' ');
}
console.log(f('orig', 2, 3));
function outer() {
  const arrow = () => arguments[0];
  return arrow('arrow arg');
}
console.log(outer('outer arg'));
```

**Output**

```
orig 3 2 false true
outer arg
```

**Why**

- In strict mode, and in any function with rest or default parameters, `arguments` doesn't follow reassignments of the named parameters.
- `arguments` is array-like and counts every argument. `rest` is a real array holding only the extras.
- Arrow functions have no `arguments` of their own, so they see the enclosing function's.

**Variant:** Call `arguments.map` inside `f`.

---

## 18. Module scope is not global scope

```js
var fromVar = 1;
let fromLet = 2;
function fromFn() {}
console.log(globalThis.fromVar, globalThis.fromLet, typeof globalThis.fromFn);
console.log(this);
try {
  leaked = 5;
} catch (e) {
  console.log(`${e.name}: ${e.message}`);
}
```

**Output**

```
undefined undefined undefined
undefined
ReferenceError: leaked is not defined
```

**Why**

- Top-level declarations in a module belong to the module, not to `globalThis` (unlike `var` and functions in a classic script).
- Top-level `this` in a module is `undefined`.
- Strict mode turns assignment to an undeclared name into a `ReferenceError` instead of creating an accidental global.

**Variant:** Assign `globalThis.leaked = 5` first and repeat.

---

## 19. Per-iteration bindings plus one shared variable

```js
function setup() {
  const handlers = [];
  let shared = 0;
  for (let i = 0; i < 3; i++) {
    handlers.push(() => `${i}:${++shared}`);
  }
  return handlers;
}
const hs = setup();
console.log(hs.map((h) => h()).join(' '));
console.log(hs[0]());
```

**Output**

```
0:1 1:2 2:3
0:4
```

**Why**

- Each closure has its own `i`, but they all share the single `shared` from `setup`.
- The state lives as long as some handler can still reach it.

**Variant:** Call `setup()` a second time and use its handlers.

---

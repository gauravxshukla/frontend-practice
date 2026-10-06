# ⚡️ Tough JavaScript Snippet Questions for Senior Frontend Interviews

Each question includes:

* **Snippet**
* **Expected Output**
* **Explanation (Why it happens)**
* **Variants / Follow-ups**

---

## 1. Hoisting, `var` vs `let` (TDZ)

```js
console.log(a);
var a = 1;

console.log(b);
let b = 2;
```

**Output**

```
undefined
ReferenceError: Cannot access 'b' before initialization
```

**Why**

* `var` is hoisted and initialized to `undefined`.
* `let` is hoisted but not initialized (TDZ).

**Variants:** Try with `const`.

---

## 2. Function Hoisting vs Expression

```js
foo();
function foo(){ console.log('decl'); }

bar();
var bar = function() { console.log('expr'); };
```

**Output**

```
decl
TypeError: bar is not a function
```

**Why**

* Function declarations hoisted fully.
* Function expressions hoist the variable, not the function.

---

## 3. Closure in Loop with `var`

```js
for (var i=0;i<3;i++){
  setTimeout(() => console.log(i), 0);
}
```

**Output:** `3 3 3`

**Why:** `var` is function-scoped; same reference shared.

**Fix:** Use `let` or IIFE.

---

## 4. `this` Binding

```js
const obj = { x: 10, getX() { return this.x; } };
const getX = obj.getX;
console.log(obj.getX()); // A
console.log(getX());     // B
```

**Output:**

```
10
undefined
```

**Why:** `this` lost in B.

---

## 5. Arrow Function & `this`

```js
const obj = {
  x: 1,
  arrow: () => this.x,
  method() { return (() => this.x)(); }
};
console.log(obj.arrow());
console.log(obj.method());
```

**Output:**

```
undefined
1
```

**Why:** Arrow captures lexical `this`.

---

## 6. Prototype Chain

```js
function A() {}
A.prototype.x = 1;
const a = new A();
a.x = 2;
delete a.x;
console.log(a.x);
```

**Output:** `1`

**Why:** Falls back to prototype property.

---

## 7. Equality Coercion

```js
console.log([] == ![]); 
console.log([] == 0);
console.log('' == 0);
console.log(null == undefined);
```

**Output:**

```
true
true
true
true
```

**Why:** Type coercion conversions.

---

## 8. Floating Point Precision

```js
console.log(0.1 + 0.2 === 0.3);
console.log((0.1 + 0.2).toFixed(2));
```

**Output:**

```
false
"0.30"
```

**Why:** Binary rounding error.

---

## 9. Async/Await Rejection

```js
async function f() {
  await Promise.reject('err');
  console.log('after');
}
f().catch(e => console.log('caught', e));
```

**Output:** `caught err`

**Why:** Async function rejects; catch handles it.

---

## 10. Microtask vs Macrotask

```js
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
```

**Output:**

```
start
end
promise
timeout
```

**Why:** Promises (microtasks) run before timeouts (macrotasks).

---

## 11. Async Return Values

```js
async function a() { return 1; }
function b() { return Promise.resolve(1); }
console.log(a() instanceof Promise);
console.log(b() instanceof Promise);
```

**Output:** `true true`

---

## 12. Promise Chaining

```js
Promise.resolve(1)
  .then(x => x + 1)
  .then(x => { x + 1 })
  .then(x => console.log(x));
```

**Output:** `undefined`

**Why:** Missing `return` in block body.

---

## 13. Object Key Order

```js
const obj = { '2': 'two', '1': 'one', 'b': 'bee', 'a': 'aye' };
console.log(Object.keys(obj));
```

**Output:** `[ '1', '2', 'b', 'a' ]`

---

## 14. Shallow Copy

```js
const a = { x: { y: 1 } };
const b = {...a};
b.x.y = 2;
console.log(a.x.y);
```

**Output:** `2`

**Why:** Spread is shallow.

---

## 15. `Object.freeze` Depth

```js
const o = Object.freeze({ x: { y: 1 } });
o.x.y = 2;
console.log(o.x.y);
```

**Output:** `2`

**Why:** Shallow freeze only.

---

## 16. Constructor Return Object

```js
function F(){ this.a = 1; return {a: 2}; }
const i = new F();
console.log(i.a);
```

**Output:** `2`

**Why:** Constructor returns object, overrides `this`.

---

## 17. `for...in` vs `for...of`

```js
const arr = ['a','b'];
arr.x = 'x';
for (const i in arr) console.log(i);
for (const v of arr) console.log(v);
```

**Output:**

```
0
1
x
a
b
```

---

## 18. Default Params + TDZ

```js
let x = 1;
function f(a = x, x) {
  console.log(a);
}
f(undefined, 2);
```

**Output:** `1`

**Why:** Outer `x` used during default param evaluation.

---

## 19. `bind` with `new`

```js
function F(){ this.x = 1; }
const Bound = F.bind({x:2});
const instance = new Bound();
console.log(instance.x);
```

**Output:** `1`

**Why:** `new` overrides bound `this`.

---

## 20. Generator Promise

```js
function* gen(){ yield Promise.resolve(1); }
const g = gen();
g.next().value.then(v => console.log(v));
```

**Output:** `1`

---

## 21. Symbol Keys

```js
const s = Symbol('s');
const o = { a: 1 };
o[s] = 2;
console.log(Object.keys(o), Object.getOwnPropertySymbols(o));
```

**Output:** `[ 'a' ] [ Symbol(s) ]`

---

## 22. Proxy Handler `this`

```js
const target = { a:1 };
const p = new Proxy(target, {
  get(t,k,receiver){
    console.log(this === p);
    return Reflect.get(t,k,receiver);
  }
});
p.a;
```

**Output:**

```
false
1
```

---

## 23. Map Mutation in Loop

```js
const m = new Map([[1, 'a'], [2, 'b']]);
for (const [k,v] of m) {
  console.log(k);
  if (k === 1) m.delete(2);
}
```

**Output:** `1`

---

## 24. Async Await Timing

```js
console.log('script start');
(async function(){
  console.log('in async');
  await null;
  console.log('after await');
})();
console.log('script end');
```

**Output:**

```
script start
in async
script end
after await
```

---

## 25. JSON Circular Reference

```js
const a = {};
a.self = a;
JSON.stringify(a);
```

**Output:** `TypeError: Converting circular structure to JSON`

---

## 26. Function `.length`

```js
function f(a, b=2, c) {}
console.log(f.length);
```

**Output:** `1`

---

## 27. WeakMap GC Behavior

```js
let k = {};
const wm = new WeakMap();
wm.set(k, 'value');
k = null;
```

**Why:** WeakMap keys are weakly held; allow GC.

---

## 28. `valueOf` Coercion

```js
const obj = { valueOf() { return 1 } };
console.log(obj == 1);
```

**Output:** `true`

---

## 29. Array Sort Lexicographically

```js
const arr = [1,2,10,21];
arr.sort();
console.log(arr);
```

**Output:** `[1,10,2,21]`

---

## 30. Prototype Mutation Performance

Changing prototype at runtime using `__proto__` or `Object.setPrototypeOf` is **slow** and **deoptimizes** engines. Prefer static class-based inheritance or composition.

---

## 💡 Interview Tips

* State output **confidently first**.
* Then explain **spec reasoning**.
* Mention **real-world fixes**.
* Give **va

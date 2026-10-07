# JavaScript Output: this, Classes and Prototypes

Predict what each snippet logs. These cards cover how `this` is decided at call time, how `bind`, `call` and `new` interact, and how property lookup walks the prototype chain under classes and `Object.create`. Assume every snippet runs as an ES module, which means strict mode: a plain function call gets `this === undefined` rather than the global object, and top-level `this` is `undefined`.

---

## 1. Extracting a class method

```js
class Counter {
  count = 0;
  increment() {
    this.count++;
    return this.count;
  }
}
const c = new Counter();
const inc = c.increment;
console.log(c.increment());
try {
  inc();
} catch (e) {
  console.log(`${e.name}: ${e.message}`);
}
```

**Output**

```
1
TypeError: Cannot read properties of undefined (reading 'count')
```

**Why**

- `this` depends on how a function is called, not where it was defined. `inc()` has no receiver.
- Class bodies are always strict, so `this` is `undefined` rather than `globalThis`.

**Variant:** Fix it with `c.increment.bind(c)`, and then again with an arrow class field.

---

## 2. Nested `function` vs arrow inside a method

```js
const team = {
  name: 'core',
  members: ['ana', 'bo'],
  withFunction() {
    return this.members.map(function (m) { return `${m}@${this?.name}`; }).join(', ');
  },
  withArrow() {
    return this.members.map((m) => `${m}@${this.name}`).join(', ');
  },
};
console.log(team.withFunction());
console.log(team.withArrow());
```

**Output**

```
ana@undefined, bo@undefined
ana@core, bo@core
```

**Why**

- The inner `function` gets its own `this`, which is `undefined` because `map` calls it plainly.
- An arrow has no `this` of its own, so it uses the `this` of the enclosing method, which is `team`.

**Variant:** Pass `this` as `map`'s second argument in `withFunction`.

---

## 3. `forEach`'s `thisArg`

```js
const tagger = {
  prefix: '#',
  tagAll(words) {
    const out = [];
    words.forEach(function (w) { out.push(this.prefix + w); }, this);
    return out.join(' ');
  },
};
console.log(tagger.tagAll(['js', 'css']));
const results = [1].map(() => typeof this, { ignored: true });
console.log(results[0]);
```

**Output**

```
#js #css
undefined
```

**Why**

- Array methods call a regular function with their `thisArg` argument as `this`.
- Arrow functions ignore `thisArg`. This arrow sits at module top level, where `this` is `undefined`.

**Variant:** Replace the `forEach` callback with an arrow and drop the `this` argument.

---

## 4. `this` in `setTimeout` callbacks

```js
const timer = {
  label: 'T',
  startRegular() {
    setTimeout(function () { console.log('regular:', this === timer); }, 0);
  },
  startArrow() {
    setTimeout(() => console.log('arrow:', this.label), 0);
  },
};
timer.startRegular();
timer.startArrow();
```

**Output**

```
regular: false
arrow: T
```

**Why**

- The timer calls a regular function without your object as `this`. Browsers pass `window`; Node passes a `Timeout` object. Neither one is `timer`.
- The arrow captures `this` from `startArrow`, which was called as `timer.startArrow()`.

**Variant:** Pass `timer.startRegular` itself to `setTimeout` and log `this?.label`.

---

## 5. Precedence of `call`, `apply` and `bind`

```js
function who() {
  return this.name;
}
const a = { name: 'a' };
const b = { name: 'b' };
const c = { name: 'c' };
const boundA = who.bind(a);
console.log(boundA.call(b));
console.log(boundA.bind(c)());
console.log(who.call(b), who.apply(c, []));
```

**Output**

```
a
a
b c
```

**Why**

- `bind` creates a wrapper that always calls the original with the `this` it was bound to.
- `call`, `apply` and a second `bind` only change the wrapper's `this`, and the wrapper ignores it.
- On an unbound function, `call` and `apply` set `this` directly.

**Variant:** Make `who` an arrow function and predict all four results.

---

## 6. Binding twice: `this` is fixed, arguments add up

```js
function sum(x, y, z) {
  return `${this.tag}:${x + y + z}`;
}
const first = sum.bind({ tag: 'one' }, 1);
const second = first.bind({ tag: 'two' }, 2);
console.log(second(3));
console.log(second.name, second.length);
```

**Output**

```
one:6
bound bound sum 1
```

**Why**

- The first `bind` fixes `this` for good, but each `bind` still prepends its own arguments.
- Every bound function gets the name `bound <name>`, and its `length` is the original arity minus the arguments bound so far.

**Variant:** Call `new second(3)` after giving `sum` a `this.total = x + y + z`.

---

## 7. `new` on a bound class

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const AtOrigin = Point.bind({ ignored: true }, 0);
const p = new AtOrigin(5);
console.log(p.x, p.y, p.ignored);
console.log(p instanceof Point, p instanceof AtOrigin);
console.log('prototype' in AtOrigin);
```

**Output**

```
0 5 undefined
true true
false
```

**Why**

- `new` ignores the bound `this` but keeps the bound arguments, so `x` is `0`.
- A bound function has no `prototype` of its own, so `instanceof` checks against the target, `Point`.

**Variant:** Call `AtOrigin(5)` without `new`.

---

## 8. Arrow class field vs prototype method

```js
class Button {
  label = 'save';
  onClickArrow = () => this.label;
  onClickMethod() {
    return this?.label;
  }
}
const b1 = new Button();
const b2 = new Button();
const { onClickArrow, onClickMethod } = b1;
console.log(onClickArrow(), onClickMethod());
console.log(b1.onClickArrow === b2.onClickArrow, b1.onClickMethod === b2.onClickMethod);
console.log(Object.hasOwn(b1, 'onClickArrow'), Object.hasOwn(b1, 'onClickMethod'));
```

**Output**

```
save undefined
false true
true false
```

**Why**

- Field initialisers run once per instance with `this` set to that instance, so each object gets its own bound arrow.
- Methods live once on `Button.prototype`, so they are shared, and they lose `this` when extracted.
- The tradeoff: arrow fields cost one function per instance and can't be reached with `super`.

**Variant:** Subclass `Button` and try overriding `onClickArrow` as a method.

---

## 9. `super` is fixed to where the method was defined

```js
class Animal {
  speak() {
    return `${this.name} makes a sound`;
  }
}
class Dog extends Animal {
  constructor(name) {
    super();
    this.name = name;
  }
  speak() {
    return `${super.speak()} (woof)`;
  }
}
const d = new Dog('Rex');
console.log(d.speak());
const borrowed = { name: 'Cat', speak: d.speak };
console.log(borrowed.speak());
```

**Output**

```
Rex makes a sound (woof)
Cat makes a sound (woof)
```

**Why**

- `super.speak` is looked up from the method's home object, `Dog.prototype`, so it finds `Animal.prototype.speak`.
- `this` is still dynamic. `super.speak()` is called with the current receiver, which is `borrowed`.

**Variant:** Read `this.name` in `Dog`'s constructor before calling `super()`.

---

## 10. Static vs instance members

```js
class Config {
  static defaults = { theme: 'dark' };
  static create() {
    return new this();
  }
  theme = Config.defaults.theme;
  hasCreate() {
    return typeof this.create;
  }
}
class Child extends Config {}
const c = Child.create();
console.log(c instanceof Child, c.theme);
console.log(c.hasCreate(), typeof Child.create);
console.log(Object.hasOwn(Child, 'defaults'), Child.defaults === Config.defaults);
```

**Output**

```
true dark
undefined function
false true
```

**Why**

- Static members live on the constructor, not on instances, so `c.create` is `undefined`.
- In a static method, `this` is the class it was called on, so `new this()` builds a `Child`.
- `Child`'s prototype is `Config`, so it inherits static members by lookup without copying them.

**Variant:** Assign `Child.defaults = {}` and check `Config.defaults`.

---

## 11. Assigning vs mutating through the prototype

```js
const base = { greeting: 'hi', tags: [] };
const obj = Object.create(base);
obj.greeting = 'hello';
obj.tags.push('x');
console.log(obj.greeting, base.greeting);
console.log(base.tags.length, Object.hasOwn(obj, 'tags'));
const other = Object.create(base);
console.log(other.tags.join());
```

**Output**

```
hello hi
1 false
x
```

**Why**

- Assigning to a property creates an own property that shadows the prototype's.
- `obj.tags.push` only reads `tags`, finds the shared array on `base` and mutates it, so every object made from `base` sees the change.

**Variant:** Replace the push with `obj.tags = [...obj.tags, 'x']`.

---

## 12. A read-only prototype property blocks shadowing

```js
const base = Object.defineProperty({}, 'id', { value: 1, writable: false });
const child = Object.create(base);
try {
  child.id = 2;
} catch (e) {
  console.log(`${e.name}: ${e.message}`);
}
Object.defineProperty(child, 'id', { value: 3 });
console.log(child.id, base.id);
```

**Output**

```
TypeError: Cannot assign to read only property 'id' of object '#<Object>'
3 1
```

**Why**

- Plain assignment checks the inherited property's `writable` flag, so a non-writable prototype property blocks it. In strict mode it throws.
- `Object.defineProperty` skips that check and creates an own property directly.

**Variant:** Make `base.id` a getter without a setter and assign again.

---

## 13. `Object.create` with descriptors and `null`

```js
const proto = { hello() { return 'hi from proto'; } };
const a = Object.create(proto, { own: { value: 1 } });
console.log(a.hello(), a.own, Object.keys(a).length);
console.log(Object.getPrototypeOf(a) === proto);
const bare = Object.create(null);
bare.key = 'v';
console.log('toString' in bare, typeof bare.hasOwnProperty);
```

**Output**

```
hi from proto 1 0
true
false undefined
```

**Why**

- Descriptor flags default to `false`, so `own` is non-enumerable and doesn't show up in `Object.keys`.
- `Object.create(null)` has no prototype, so it has no `toString` and no `hasOwnProperty`. Use `Object.hasOwn` for objects like this.

**Variant:** Call `` `${bare}` `` and predict the error.

---

## 14. `in` vs `hasOwnProperty`

```js
class User {
  name = 'ann';
  greet() {}
}
const u = new User();
u.extra = undefined;
console.log('name' in u, u.hasOwnProperty('name'));
console.log('greet' in u, u.hasOwnProperty('greet'));
console.log('extra' in u, u.extra !== undefined);
console.log('toString' in u, Object.hasOwn(u, 'toString'));
```

**Output**

```
true true
true false
true false
true false
```

**Why**

- `in` walks the whole prototype chain. `hasOwnProperty` and `Object.hasOwn` look at the object only.
- Class fields are own properties, while methods live on the prototype.
- A property that exists with the value `undefined` still counts for `in`.

**Variant:** `delete u.extra` and repeat the third line.

---

## 15. `instanceof` after replacing the prototype

```js
function Car() {}
const before = new Car();
Car.prototype = { wheels: 4 };
const after = new Car();
console.log(before instanceof Car, after instanceof Car);
console.log(before.wheels, after.wheels);
console.log(before.constructor === Car, after.constructor === Car);
```

**Output**

```
false true
undefined 4
true false
```

**Why**

- `instanceof` checks whether the current `Car.prototype` object is anywhere in the instance's chain. `before` still links to the old prototype object.
- The new prototype is a plain object literal with no `constructor` property, so `after.constructor` resolves to `Object`.

**Variant:** Mutate `Car.prototype.wheels = 4` instead of replacing it.

---

## 16. A getter on the prototype

```js
const proto = {
  get full() {
    return `${this.first} ${this.last}`;
  },
};
const p = Object.create(proto);
p.first = 'Ada';
p.last = 'Lovelace';
console.log(p.full);
try {
  p.full = 'x';
} catch (e) {
  console.log(`${e.name}: ${e.message}`);
}
console.log(Object.keys(p).join(), Object.hasOwn(p, 'full'));
```

**Output**

```
Ada Lovelace
TypeError: Cannot set property full of #<Object> which has only a getter
first,last false
```

**Why**

- An inherited getter runs with `this` set to the object you read from, `p`, not the prototype.
- An inherited accessor intercepts assignment too. With no setter, strict mode throws instead of creating an own property.

**Variant:** Add `set full(v) { [this.first, this.last] = v.split(' '); }` to `proto`.

---

## 17. Class declarations are in the TDZ

```js
try {
  new Shape();
} catch (e) {
  console.log(`${e.name}: ${e.message}`);
}
class Shape {}
console.log(typeof Shape);
```

**Output**

```
ReferenceError: Cannot access 'Shape' before initialization
function
```

**Why**

- `class` declarations are hoisted like `let`: the name exists from the start of its scope but can't be used before the declaration runs.
- A class is a special kind of function, so `typeof` reports `'function'`.

**Variant:** Write `class Sub extends Base {}` above `class Base {}`.

---

## 18. Parentheses and `this`

```js
const obj = {
  id: 7,
  getId() {
    return this?.id;
  },
};
console.log(obj.getId());
console.log((obj.getId)());
console.log((0, obj.getId)());
console.log((obj?.getId)());
```

**Output**

```
7
7
undefined
7
```

**Why**

- Grouping parentheses keep the property reference, so the call still has a receiver.
- The comma operator evaluates to the bare function value, so the receiver is lost. Bundlers use `(0, fn)()` on purpose for this reason.

**Variant:** Try `(obj.getId = obj.getId)()`.

---

## 19. A class field shadows an inherited getter

```js
class Base {
  get kind() {
    return 'getter';
  }
}
class WithField extends Base {
  kind = 'field';
}
class WithAssign extends Base {
  constructor() {
    super();
    this.kind = 'assigned';
  }
}
console.log(new WithField().kind);
try { new WithAssign(); } catch (e) { console.log(e.name); }
```

**Output**

```
field
TypeError
```

**Why**

- Class fields are created with define semantics: an own data property is added directly, so the inherited accessor is never consulted.
- `this.kind = …` is an assignment. It finds the getter-only accessor on the prototype, and in strict code that throws a `TypeError`.

**Variant:** Give `Base` a matching setter and see which classes call it.

---

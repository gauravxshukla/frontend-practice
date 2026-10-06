
# JavaScript Array and Object Methods

## Array Methods

### Mutating Methods (Change the original array)

#### 1. push()
Adds one or more elements to the end of an array.
```javascript
const arr = [1, 2, 3];
arr.push(4, 5); // [1, 2, 3, 4, 5]
```

#### 2. pop()
Removes the last element from an array and returns it.
```javascript
const arr = [1, 2, 3];
const last = arr.pop(); // last = 3, arr = [1, 2]
```

#### 3. unshift()
Adds one or more elements to the beginning of an array.
```javascript
const arr = [2, 3];
arr.unshift(0, 1); // [0, 1, 2, 3]
```

#### 4. shift()
Removes the first element from an array and returns it.
```javascript
const arr = [1, 2, 3];
const first = arr.shift(); // first = 1, arr = [2, 3]
```

#### 5. splice()
Changes the contents of an array by removing, replacing, or adding elements.
```javascript
const arr = [1, 2, 3, 4, 5];
arr.splice(2, 1, 'a', 'b'); // [1, 2, 'a', 'b', 4, 5]
```

#### 6. reverse()
Reverses the order of elements in an array.
```javascript
const arr = [1, 2, 3];
arr.reverse(); // [3, 2, 1]
```

#### 7. sort()
Sorts the elements of an array in place.
```javascript
const arr = [3, 1, 4, 1, 5];
arr.sort(); // [1, 1, 3, 4, 5]
arr.sort((a, b) => b - a); // [5, 4, 3, 1, 1]
```

#### 8. fill()
Fills all elements of an array with a static value.
```javascript
const arr = [1, 2, 3, 4];
arr.fill(0, 2, 4); // [1, 2, 0, 0]
```

### Non-Mutating Methods (Don't change the original array)

#### 9. concat()
Returns a new array that is the result of merging two or more arrays.
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = arr1.concat(arr2); // [1, 2, 3, 4]
```

#### 10. slice()
Returns a shallow copy of a portion of an array.
```javascript
const arr = [1, 2, 3, 4, 5];
const sliced = arr.slice(1, 4); // [2, 3, 4]
```

#### 11. join()
Joins all elements of an array into a string.
```javascript
const arr = ['Hello', 'World'];
const str = arr.join(' '); // "Hello World"
```

#### 12. toString()
Returns a string representing the array.
```javascript
const arr = [1, 2, 3];
const str = arr.toString(); // "1,2,3"
```

### Iteration Methods

#### 13. forEach()
Executes a provided function once for each array element.
```javascript
const arr = [1, 2, 3];
arr.forEach(item => console.log(item * 2)); // 2, 4, 6
```

#### 14. map()
Creates a new array with the results of calling a function for every array element.
```javascript
const arr = [1, 2, 3];
const doubled = arr.map(x => x * 2); // [2, 4, 6]
```

#### 15. filter()
Creates a new array with all elements that pass a test.
```javascript
const arr = [1, 2, 3, 4, 5];
const evens = arr.filter(x => x % 2 === 0); // [2, 4]
```

#### 16. reduce()
Reduces an array to a single value by executing a reducer function.
```javascript
const arr = [1, 2, 3, 4];
const sum = arr.reduce((acc, curr) => acc + curr, 0); // 10
```

#### 17. reduceRight()
Applies a function against an accumulator and each value from right to left.
```javascript
const arr = [1, 2, 3, 4];
const result = arr.reduceRight((acc, curr) => acc - curr); // -2
```

#### 18. find()
Returns the first element that satisfies a testing function.
```javascript
const arr = [1, 2, 3, 4, 5];
const found = arr.find(x => x > 3); // 4
```

#### 19. findIndex()
Returns the index of the first element that satisfies a testing function.
```javascript
const arr = [1, 2, 3, 4, 5];
const index = arr.findIndex(x => x > 3); // 3
```

#### 20. some()
Tests whether at least one element passes the test.
```javascript
const arr = [1, 2, 3, 4, 5];
const hasEven = arr.some(x => x % 2 === 0); // true
```

#### 21. every()
Tests whether all elements pass the test.
```javascript
const arr = [2, 4, 6, 8];
const allEven = arr.every(x => x % 2 === 0); // true
```

#### 22. includes()
Determines whether an array includes a certain value.
```javascript
const arr = [1, 2, 3, 4, 5];
const hasThree = arr.includes(3); // true
```

#### 23. indexOf()
Returns the first index at which a given element can be found.
```javascript
const arr = [1, 2, 3, 2, 4];
const index = arr.indexOf(2); // 1
```

#### 24. lastIndexOf()
Returns the last index at which a given element can be found.
```javascript
const arr = [1, 2, 3, 2, 4];
const lastIndex = arr.lastIndexOf(2); // 3
```

### Array Properties

#### 25. length
Returns the number of elements in an array.
```javascript
const arr = [1, 2, 3, 4, 5];
console.log(arr.length); // 5
```

### Static Array Methods

#### 26. Array.isArray()
Determines whether the passed value is an array.
```javascript
Array.isArray([1, 2, 3]); // true
Array.isArray('hello'); // false
```

#### 27. Array.from()
Creates a new array from an array-like or iterable object.
```javascript
Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
Array.from({length: 3}, (_, i) => i); // [0, 1, 2]
```

#### 28. Array.of()
Creates a new array with a variable number of arguments.
```javascript
Array.of(1, 2, 3); // [1, 2, 3]
Array.of(7); // [7]
```

## Object Methods

### Object Creation Methods

#### 1. Object.create()
Creates a new object with the specified prototype object.
```javascript
const proto = { greet: function() { return 'Hello'; } };
const obj = Object.create(proto);
console.log(obj.greet()); // "Hello"
```

#### 2. Object.assign()
Copies all enumerable properties from source objects to a target object.
```javascript
const target = { a: 1 };
const source = { b: 2, c: 3 };
Object.assign(target, source); // { a: 1, b: 2, c: 3 }
```

#### 3. Object.defineProperty()
Defines a new property directly on an object or modifies an existing property.
```javascript
const obj = {};
Object.defineProperty(obj, 'prop', {
  value: 42,
  writable: false
});
```

### Object Property Methods

#### 4. Object.keys()
Returns an array of a given object's own enumerable property names.
```javascript
const obj = { a: 1, b: 2, c: 3 };
Object.keys(obj); // ['a', 'b', 'c']
```

#### 5. Object.values()
Returns an array of a given object's own enumerable property values.
```javascript
const obj = { a: 1, b: 2, c: 3 };
Object.values(obj); // [1, 2, 3]
```

#### 6. Object.entries()
Returns an array of a given object's own enumerable property [key, value] pairs.
```javascript
const obj = { a: 1, b: 2, c: 3 };
Object.entries(obj); // [['a', 1], ['b', 2], ['c', 3]]
```

#### 7. Object.hasOwnProperty()
Returns a boolean indicating whether the object has the specified property.
```javascript
const obj = { a: 1, b: 2 };
obj.hasOwnProperty('a'); // true
obj.hasOwnProperty('c'); // false
```

#### 8. Object.hasOwn()
Returns true if the specified object has the indicated property as its own property.
```javascript
const obj = { a: 1, b: 2 };
Object.hasOwn(obj, 'a'); // true
Object.hasOwn(obj, 'c'); // false
```

### Object Property Descriptors

#### 9. Object.getOwnPropertyDescriptor()
Returns a property descriptor for an own property of a given object.
```javascript
const obj = { a: 1 };
Object.getOwnPropertyDescriptor(obj, 'a');
// { value: 1, writable: true, enumerable: true, configurable: true }
```

#### 10. Object.getOwnPropertyDescriptors()
Returns all own property descriptors of a given object.
```javascript
const obj = { a: 1, b: 2 };
Object.getOwnPropertyDescriptors(obj);
```

#### 11. Object.defineProperties()
Defines new or modifies existing properties directly on an object.
```javascript
const obj = {};
Object.defineProperties(obj, {
  prop1: { value: 1, writable: true },
  prop2: { value: 2, writable: false }
});
```

### Object Freezing and Sealing

#### 12. Object.freeze()
Freezes an object, preventing new properties from being added and existing properties from being modified.
```javascript
const obj = { a: 1 };
Object.freeze(obj);
obj.b = 2; // Won't work in strict mode
obj.a = 3; // Won't work in strict mode
```

#### 13. Object.seal()
Seals an object, preventing new properties from being added and marking all existing properties as non-configurable.
```javascript
const obj = { a: 1 };
Object.seal(obj);
obj.b = 2; // Won't work
obj.a = 3; // Works
```

#### 14. Object.preventExtensions()
Prevents new properties from ever being added to an object.
```javascript
const obj = { a: 1 };
Object.preventExtensions(obj);
obj.b = 2; // Won't work
```

### Object Checking Methods

#### 15. Object.is()
Determines whether two values are the same value.
```javascript
Object.is(25, 25); // true
Object.is('foo', 'foo'); // true
Object.is(NaN, NaN); // true
Object.is(0, -0); // false
```

#### 16. Object.isExtensible()
Determines if an object is extensible.
```javascript
const obj = {};
Object.isExtensible(obj); // true
Object.preventExtensions(obj);
Object.isExtensible(obj); // false
```

#### 17. Object.isFrozen()
Determines if an object is frozen.
```javascript
const obj = {};
Object.isFrozen(obj); // false
Object.freeze(obj);
Object.isFrozen(obj); // true
```

#### 18. Object.isSealed()
Determines if an object is sealed.
```javascript
const obj = {};
Object.isSealed(obj); // false
Object.seal(obj);
Object.isSealed(obj); // true
```

### Object Prototype Methods

#### 19. Object.getPrototypeOf()
Returns the prototype of the specified object.
```javascript
const obj = {};
Object.getPrototypeOf(obj) === Object.prototype; // true
```

#### 20. Object.setPrototypeOf()
Sets the prototype of a specified object to another object.
```javascript
const obj = {};
const proto = { a: 1 };
Object.setPrototypeOf(obj, proto);
console.log(obj.a); // 1
```

### Object Property Names

#### 21. Object.getOwnPropertyNames()
Returns an array of all properties (including non-enumerable properties) found directly upon a given object.
```javascript
const obj = { a: 1 };
Object.defineProperty(obj, 'b', { value: 2, enumerable: false });
Object.getOwnPropertyNames(obj); // ['a', 'b']
```

#### 22. Object.getOwnPropertySymbols()
Returns an array of all symbol properties found directly upon a given object.
```javascript
const sym = Symbol('key');
const obj = { [sym]: 'value' };
Object.getOwnPropertySymbols(obj); // [Symbol(key)]
```

### Object Iteration

#### 23. Object.fromEntries()
Transforms a list of key-value pairs into an object.
```javascript
const entries = [['a', 1], ['b', 2]];
const obj = Object.fromEntries(entries); // { a: 1, b: 2 }
```

### Object Grouping (ES2024)

#### 24. Object.groupBy()
Groups the elements of an array according to the string values returned by a provided callback function.
```javascript
const inventory = [
  { name: 'asparagus', type: 'vegetables', quantity: 5 },
  { name: 'bananas', type: 'fruit', quantity: 0 },
  { name: 'goat', type: 'meat', quantity: 23 }
];
Object.groupBy(inventory, ({ type }) => type);
```

## Common Use Cases

### Array Methods for Data Processing
```javascript
// Filter and map data
const users = [
  { name: 'John', age: 30, active: true },
  { name: 'Jane', age: 25, active: false },
  { name: 'Bob', age: 35, active: true }
];

const activeUserNames = users
  .filter(user => user.active)
  .map(user => user.name);
// ['John', 'Bob']
```

### Object Methods for Data Manipulation
```javascript
// Merge objects
const defaultConfig = { theme: 'light', lang: 'en' };
const userConfig = { theme: 'dark' };
const finalConfig = Object.assign({}, defaultConfig, userConfig);
// { theme: 'dark', lang: 'en' }

// Check if object has properties
const hasRequiredProps = ['name', 'email'].every(prop => 
  Object.hasOwn(user, prop)
);
```

### Modern ES6+ Array Methods
```javascript
// Using spread operator with arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Destructuring arrays
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]
```

### Modern ES6+ Object Methods
```javascript
// Object destructuring
const { name, age, ...otherProps } = { name: 'John', age: 30, city: 'NYC' };

// Computed property names
const key = 'dynamicKey';
const obj = { [key]: 'value' }; // { dynamicKey: 'value' }

// Object shorthand
const name = 'John';
const age = 30;
const person = { name, age }; // { name: 'John', age: 30 }
```


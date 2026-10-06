Link - https://www.patterns.dev/react/

### useMemo

- **What it does**: Caches the result of an expensive calculation between renders until its dependencies change.
- **When to use**: Heavy computations or derived data that would be wasteful to recompute every render.

```jsx
import { useMemo, useState } from 'react';

function ExampleUseMemo({ items }) {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    // pretend this is expensive
    return items.filter(i => i.toLowerCase().includes(filter.toLowerCase()));
  }, [items, filter]);

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ul>{filtered.map(i => <li key={i}>{i}</li>)}</ul>
    </div>
  );
}
```

### useCallback

- **What it does**: Returns a memoized function reference that only changes when its dependencies change.
- **When to use**: Passing callbacks to memoized children to avoid unnecessary re-renders, or to keep stable references.

```jsx
import { useCallback, useState, memo } from 'react';

const Child = memo(function Child({ onAdd }) {
  return <button onClick={onAdd}>Add</button>;
});

function ExampleUseCallback() {
  const [count, setCount] = useState(0);

  const handleAdd = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <p>{count}</p>
      <Child onAdd={handleAdd} />
    </div>
  );
}
```

### useRef

- **What it does**: Holds a mutable value that persists across renders without causing re-renders when updated. Also used for DOM element refs.
- **When to use**: Storing instance values (timers, previous values) or accessing DOM nodes.

```jsx
import { useEffect, useRef, useState } from 'react';

function ExampleUseRef() {
  const renderCount = useRef(0);
  const inputRef = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    renderCount.current += 1;
  });

  const focusInput = () => inputRef.current?.focus();

  return (
    <div>
      <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)} />
      <button onClick={focusInput}>Focus</button>
      <p>Renders: {renderCount.current}</p>
    </div>
  );
}
```

### useEffect cleanup

- **What it does**: The function returned from an effect runs to clean up (unsubscribe/clear) before the effect re-runs or when the component unmounts.
- **When to use**: Subscriptions, timers, event listeners — to avoid memory leaks and stale effects.

```jsx
import { useEffect, useState } from 'react';

function ExampleUseEffectCleanup() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id); // cleanup
  }, []);

  return <div>Seconds: {seconds}</div>;
}
```

### useLayoutEffect

- **What it does**: Like `useEffect`, but runs synchronously after DOM mutations and before the browser paints.
- **When to use**: Reading layout/measurements and synchronously applying updates to avoid visual flicker. Prefer `useEffect` unless you specifically need layout reads/writes.

```jsx
import { useLayoutEffect, useRef, useState } from 'react';

function ExampleUseLayoutEffect() {
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    // read layout before paint
    setWidth(boxRef.current?.getBoundingClientRect().width ?? 0);
  });

  return (
    <div>
      <div ref={boxRef} style={{ width: '50%' }}>Measure me</div>
      <p>Width: {Math.round(width)}px</p>
    </div>
  );
}
```

Notes:
- **Prefer `useEffect`** unless you need synchronous layout reads/writes; `useLayoutEffect` can block painting.
- **Memoization (`useMemo`, `useCallback`)** is a performance hint, not a guarantee — measure before optimizing.


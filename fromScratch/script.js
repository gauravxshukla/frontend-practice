/*
    This is the entry point for the app.
    Problems to solve:
      React (Implement React from scratch)
       1. React.createElement
       2. React.render
       3. React.useState
       4. React.useEffect
       5. React.useRef
       6. React.memo (memoize a component)
       7. React.lazy (lazy load a component)
       8. React.Suspense (suspend a component)
       9. React.useContext
       10. React.useCallback
       11. React.useMemo
       12. React.createContext
       13. React.createRef
       14. React.forwardRef

       Redux (Implement Redux from scratch)
       1. createStore
       2. applyMiddleware
       3. combineReducers
       4. bindActionCreators
       5. compose
       6. connect
       7. Provider
       8. combineReducers
       9. bindActionCreators
       10. compose
       11. connect
       12. Provider

        React Query (Implement React Query from scratch)
       1. useQuery
       2. useMutation
       3. useInfiniteQuery
       4. usePaginatedQuery
       5. useDebounce
       6. useThrottle
*/

import React from "./react.js";


const $rootEl = document.getElementById('root');

// Create a React element
// const element = React.createElement(
//   'div',
//   { 
//     className: 'app-container',
//     style: 'padding: 20px; background-color: #f0f0f0; border-radius: 8px;'
//   },
//   React.createElement('h1', { style: 'color: #333;' }, 'Hello from Custom React!'),
//   React.createElement('p', { style: 'color: #666;' }, 'This element was created using React.createElement()'),
//   React.createElement('button', { 
//     style: 'background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;',
//     onclick: () => alert('Button clicked!')
//   }, 'Click me!')
// );


// Render the element to the DOM
// React.render(element, $rootEl);


// Using createElement directly (what JSX compiles to)
const app1 = React.createElement('div', { style: 'padding: 20px; font-family: Arial;' },
  React.createElement('h1', { style: 'color: #2563eb;' }, 'JSX Support Added!'),
  React.createElement('p', null, 'You can now write JSX-like code'),
  React.createElement('button', 
    { 
      style: 'padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 4px;',
      onclick: () => alert('JSX button works!')
    }, 
    'Try JSX'
  )
);


// Render the example
$rootEl.innerHTML = '';
React.render(app1, $rootEl);

// ===== NEW CODE: React Class Component and Functions =====


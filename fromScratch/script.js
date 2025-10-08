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

const app1 = React.createElement(
  'h1',                      // Type
  { style: 'color: red;' }, // Props
  'Hi! React from Scratch' // Childrem
);


// Render the example
$rootEl.innerHTML = '';
React.render(app1, $rootEl);


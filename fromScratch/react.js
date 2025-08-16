
export default class React {

  static createElement(type, props = {}, ...children) {
    // Create a virtual DOM element object
    return {
      type,
      props: {
        ...props,
        children: children.length === 1 ? children[0] : children
      }
    };
  }

  // Helper method to render virtual DOM to actual DOM
  static render(element, container) {
    if (typeof element === 'string' || typeof element === 'number') {
      container.appendChild(document.createTextNode(element));
      return;
    }

    const domElement = document.createElement(element.type);
    
    // Set properties
    Object.keys(element.props).forEach(key => {
      if (key !== 'children') {
        domElement[key] = element.props[key];
      }
    });

    // Handle children
    const children = Array.isArray(element.props.children) 
      ? element.props.children 
      : [element.props.children];
    
    children.forEach(child => {
      if (child) React.render(child, domElement);
    });
    container.appendChild(domElement);
  }

  // Global state to track hooks for current component
  static currentComponent = null;
  static hookIndex = 0;
  static hooks = new Map(); // componentId -> hooks array

  // 3. useState - manages component state
  static useState(initialValue) {
    // Get unique component ID and current hook index
    const componentId = React.currentComponent;
    const hookIdx = React.hookIndex++;
    
    // Initialize hooks array for this component if needed
    if (!React.hooks.has(componentId)) {
      React.hooks.set(componentId, []);
    }
    
    const componentHooks = React.hooks.get(componentId);
    
    // Initialize state for this hook if first time
    if (componentHooks[hookIdx] === undefined) {
      componentHooks[hookIdx] = { state: initialValue };
    }
    
    const hook = componentHooks[hookIdx];
    
    // setState function that triggers re-render
    const setState = (newValue) => {
      hook.state = typeof newValue === 'function' ? newValue(hook.state) : newValue;
      // Trigger re-render when state changes
      React.reRender();
    };
    
    return [hook.state, setState];
  }

  // 4. useEffect - handles side effects and lifecycle events
  static useEffect(callback, dependencies) {
    const componentId = React.currentComponent;
    const hookIdx = React.hookIndex++;
    
    if (!React.hooks.has(componentId)) {
      React.hooks.set(componentId, []);
    }
    
    const componentHooks = React.hooks.get(componentId);
    
    // Check if dependencies changed by comparing with previous render
    const prevDeps = componentHooks[hookIdx]?.deps;
    const depsChanged = !prevDeps || 
      !dependencies || 
      dependencies.some((dep, i) => dep !== prevDeps[i]);
    
    // Run effect only if dependencies changed
    if (depsChanged) {
      // Cleanup previous effect if exists
      if (componentHooks[hookIdx]?.cleanup) {
        componentHooks[hookIdx].cleanup();
      }
      
      // Run new effect and store cleanup function (if any)
      const cleanup = callback();
      componentHooks[hookIdx] = { 
        deps: dependencies ? [...dependencies] : null, 
        cleanup 
      };
    }
  }

  // 5. useRef - creates a mutable ref object that persists across renders
  static useRef(initialValue) {
    const componentId = React.currentComponent;
    const hookIdx = React.hookIndex++;
    
    if (!React.hooks.has(componentId)) {
      React.hooks.set(componentId, []);
    }
    
    const componentHooks = React.hooks.get(componentId);
    
    // Initialize ref if first time - refs never change reference
    if (!componentHooks[hookIdx]) {
      componentHooks[hookIdx] = { current: initialValue };
    }
    
    return componentHooks[hookIdx];
  }

  // 6. memo - memoizes a component to prevent unnecessary re-renders
  static memo(component, areEqual) {
    return function MemoizedComponent(props) {
      // Create cache key from props (simplified comparison)
      const propsKey = JSON.stringify(props);
      
      // Initialize cache for this component
      if (!component._memoCache) {
        component._memoCache = new Map();
      }
      
      // Return cached result if props haven't changed
      if (component._memoCache.has(propsKey)) {
        return component._memoCache.get(propsKey);
      }
      
      // Compute new result and cache it
      const result = component(props);
      component._memoCache.set(propsKey, result);
      
      return result;
    };
  }

  // 7. lazy - lazy loads a component asynchronously
  static lazy(importFunc) {
    return function LazyComponent(props) {
      // Check if component is already loaded
      if (!LazyComponent._loaded) {
        LazyComponent._loading = true;
        
        // Load component asynchronously using import function
        importFunc().then(module => {
          LazyComponent._component = module.default || module;
          LazyComponent._loaded = true;
          LazyComponent._loading = false;
          React.reRender(); // Re-render when component loads
        });
        
        // Return loading placeholder while component loads
        return React.createElement('div', null, 'Loading component...');
      }
      
      // Return loaded component with props
      return React.createElement(LazyComponent._component, props);
    };
  }

  // 8. Suspense - provides fallback UI while lazy components load
  static Suspense({ fallback, children }) {
    // Check if any child component is currently loading
    const hasLoadingChild = React.checkForLoadingChildren(children);
    
    // Show fallback UI if loading, otherwise show actual children
    return hasLoadingChild ? fallback : children;
  }

  // Helper: Check if children contain any loading lazy components
  static checkForLoadingChildren(children) {
    if (!children) return false;
    
    const childArray = Array.isArray(children) ? children : [children];
    
    // Recursively check for loading components
    return childArray.some(child => {
      if (typeof child === 'object' && child.type && child.type._loading) {
        return true;
      }
      return false;
    });
  }

  // Helper: Simple re-render mechanism for state updates
  static reRender() {
    // In real React, this uses sophisticated reconciliation algorithm
    // For simplicity, we re-render the entire last rendered component
    if (React.lastRender) {
      React.lastRender.container.innerHTML = '';
      React.hookIndex = 0; // Reset hook index for fresh render
      React.render(React.lastRender.element, React.lastRender.container);
    }
  }

  // Store last render info for re-rendering
  static lastRender = null;

  // Enhanced render that supports hooks
  static renderWithHooks(element, container, componentId = 'root') {
    React.currentComponent = componentId;
    React.hookIndex = 0;
    React.lastRender = { element, container };
    
    React.render(element, container);
    
    React.currentComponent = null;
  }
}
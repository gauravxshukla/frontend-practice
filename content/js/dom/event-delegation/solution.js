const ELEMENT_NODE = 1;

/** True if `node` is a strict descendant of `root`. */
function isInside(root, node) {
  if (node === root) return false;
  if (typeof root.contains === 'function') return root.contains(node);
  for (let current = node; current; current = current.parentNode) {
    if (current === root) return true;
  }
  return false;
}

/**
 * @param {Element} root
 * @param {string} eventType
 * @param {string} selector
 * @param {(this: Element, event: Event, match: Element) => void} handler
 * @return {() => void} unsubscribe
 */
export default function delegate(root, eventType, selector, handler) {
  function listener(event) {
    let target = event.target;
    if (target && target.nodeType !== ELEMENT_NODE) target = target.parentNode;
    if (!target || typeof target.closest !== 'function') return;

    // The nearest matching ancestor-or-self; it may lie outside root.
    const match = target.closest(selector);
    if (match && isInside(root, match)) handler.call(match, event, match);
  }

  root.addEventListener(eventType, listener);
  return () => root.removeEventListener(eventType, listener);
}

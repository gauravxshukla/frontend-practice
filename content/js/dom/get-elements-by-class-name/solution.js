/**
 * @param {Element} element
 * @param {string} classNames
 * @return {Element[]}
 */
export default function getElementsByClassName(element, classNames) {
  const split = (value) => (value ?? '').split(/\s+/).filter(Boolean);
  const targets = split(classNames);
  const result = [];
  if (!targets.length) return result;

  function walk(node) {
    for (const child of node.children) {
      const own = new Set(split(child.getAttribute('class')));
      if (targets.every((name) => own.has(name))) result.push(child);
      walk(child);
    }
  }

  walk(element);
  return result;
}

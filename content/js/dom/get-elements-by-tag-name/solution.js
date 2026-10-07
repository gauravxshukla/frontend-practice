/**
 * @param {Element} element
 * @param {string} tagName
 * @return {Element[]}
 */
export default function getElementsByTagName(element, tagName) {
  const target = tagName.toLowerCase();
  const result = [];

  function walk(node) {
    for (const child of node.children) {
      if (target === '*' || child.tagName.toLowerCase() === target) result.push(child);
      walk(child);
    }
  }

  walk(element);
  return result;
}

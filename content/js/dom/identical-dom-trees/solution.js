const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

/**
 * @param {Node} a
 * @param {Node} b
 * @return {boolean}
 */
export default function identicalDOMTrees(a, b) {
  if (a === b) return true;
  if (!a || !b || a.nodeType !== b.nodeType) return false;

  if (a.nodeType === TEXT_NODE || a.nodeType === COMMENT_NODE) {
    return a.nodeValue === b.nodeValue;
  }

  if (a.nodeType === ELEMENT_NODE) {
    if (a.tagName !== b.tagName) return false;
    // Same count + every attribute of a matches on b => same set, in any order.
    if (a.attributes.length !== b.attributes.length) return false;
    for (const { name, value } of a.attributes) {
      if (b.getAttribute(name) !== value) return false;
    }
  }

  const childrenA = a.childNodes;
  const childrenB = b.childNodes;
  if (childrenA.length !== childrenB.length) return false;
  for (let i = 0; i < childrenA.length; i++) {
    if (!identicalDOMTrees(childrenA[i], childrenB[i])) return false;
  }
  return true;
}

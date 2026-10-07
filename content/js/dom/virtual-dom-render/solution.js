/**
 * @typedef {string | number | null | undefined | boolean | { type: string, props?: object, children?: VNode[] }} VNode
 * @param {VNode} vnode
 * @return {Node}
 */
export default function render(vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  const { type, props = {}, children = [] } = vnode;
  const el = document.createElement(type);

  for (const [name, value] of Object.entries(props ?? {})) {
    if (value == null || value === false) continue;
    if (name === 'className') {
      el.setAttribute('class', String(value));
    } else if (name === 'style' && typeof value === 'object') {
      for (const [key, styleValue] of Object.entries(value)) el.style[key] = styleValue;
    } else if (/^on[A-Z]/.test(name) && typeof value === 'function') {
      el.addEventListener(name.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(name, value === true ? '' : String(value));
    }
  }

  for (const child of children ?? []) {
    if (child == null || typeof child === 'boolean') continue;
    el.appendChild(render(child));
  }
  return el;
}

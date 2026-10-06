# Vanilla DOM Cheatsheet

Migrated from `vanillaJS/vanillaSnippets.js`.

## 1. Element creation and insertion

```js
const newEl = document.createElement('h5');
newEl.textContent = 'Created with createElement() and appended with appendChild().';
document.getElementById('app').appendChild(newEl);
```

## 2. Selecting and modifying

```js
const root = document.getElementById('app');
root.innerHTML = 'Selected with getElementById() and modified via innerHTML.';

const p = document.querySelector('p');          // first match
const headings = document.querySelectorAll('h3'); // static NodeList
headings[0].textContent = 'Selected with querySelectorAll()';
```

## 3. Event handling

```js
const button = document.createElement('button');
button.textContent = 'Click me';
document.getElementById('app').appendChild(button);

function onClick() {
  button.textContent = 'Button clicked';
}
button.addEventListener('click', onClick);
// removeEventListener needs the *same* function reference,
// so an inline arrow function can never be removed.
button.removeEventListener('click', onClick);
```

## Quick reference

| Task | API |
| --- | --- |
| Content | `el.innerHTML` (parses HTML, so beware XSS), `el.textContent` (safe text) |
| Attributes | `el.getAttribute(name)`, `el.setAttribute(name, value)`, `el.dataset.foo` |
| Classes | `el.classList.add / remove / toggle(className, force?) / contains` |
| Styles | `el.style.property = value` |
| Removal | `el.remove()` |
| Events | `el.addEventListener(type, handler, { once, passive, capture })`, `el.removeEventListener(type, handler)` |
| Event object | `event.preventDefault()`, `event.stopPropagation()`, `event.target` vs `event.currentTarget` |
| Delegation | `parent.addEventListener('click', (e) => e.target.closest('.item'))` |
| Common events | `click`, `submit`, `change`, `input`, `load`, `keydown`, `focusin` / `focusout` (they bubble, unlike `focus`) |
| Batch inserts | `document.createDocumentFragment()`, then append once |

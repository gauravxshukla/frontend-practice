// A small DOM for questions with `env: dom` (getElementsByClassName, event
// delegation…). Workers and Node have no `document`, so linkedom provides one.
// The worker, Vitest (scripts/vitest-setup.js) and the mini-Jest parity check
// all install it the same way, so DOM suites behave identically everywhere.

const GLOBALS = [
  'window',
  'document',
  'Node',
  'Element',
  'HTMLElement',
  'Text',
  'Comment',
  'Document',
  'DocumentFragment',
  'DOMParser',
  'Event',
  'CustomEvent',
  'EventTarget',
  'NodeList',
  'HTMLInputElement',
  'HTMLButtonElement',
  'HTMLAnchorElement',
  'HTMLTemplateElement',
  'SVGElement',
];

/** Installs a fresh empty document and the DOM classes on `globalThis`. */
export async function installDom() {
  const { parseHTML } = await import('linkedom');
  const { window } = parseHTML('<!doctype html><html><head></head><body></body></html>');
  for (const name of GLOBALS) {
    const value = name === 'window' ? window : window[name];
    if (value === undefined) continue;
    // Some of these (EventTarget, Event) already exist natively; the DOM's own versions must win.
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  }
  return window;
}

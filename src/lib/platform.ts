export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/** Whether a key event came from somewhere the user is typing (so single-key shortcuts must not fire). */
export function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { placeFloating, type Side } from '../../lib/floating';
import './overlay.css';

const SHOW_DELAY = 500;
// After one tooltip, neighbours show instantly for a moment (moving along a toolbar).
const SKIP_WINDOW = 300;
// Lets the pointer cross the gap onto the tooltip without it vanishing (WCAG 1.4.13).
const HIDE_GRACE = 120;

interface Tip {
  target: HTMLElement;
  text: string;
  kbd?: string;
  side: Side;
}

const SIDES = new Set<string>(['top', 'bottom', 'left', 'right']);

function readTip(target: HTMLElement): Tip | null {
  const text = target.dataset.tooltip;
  if (!text) return null;
  const side = target.dataset.tooltipSide ?? 'bottom';
  return { target, text, kbd: target.dataset.tooltipKbd, side: (SIDES.has(side) ? side : 'bottom') as Side };
}

const tooltipTarget = (node: EventTarget | null) =>
  node instanceof Element ? node.closest<HTMLElement>('[data-tooltip]') : null;

/**
 * The app's one tooltip. Any element with `data-tooltip="Label"` gets it
 * (optional `data-tooltip-kbd`, `data-tooltip-side`), through delegated listeners,
 * so there are no wrapper components. It's visual only (`aria-hidden`): elements
 * keep their accessible name in `aria-label`. Mouse hover and keyboard focus show
 * it; touch never does.
 */
export default function TooltipLayer() {
  const ref = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    let current: HTMLElement | null = null;
    let visible = false;
    let hiddenAt = 0;
    // The element just clicked: no tooltip again until the pointer leaves it.
    let suppressed: HTMLElement | null = null;
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const show = (target: HTMLElement) => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      const next = readTip(target);
      current = target;
      visible = Boolean(next);
      setTip(next);
    };
    const hide = () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      if (visible) hiddenAt = Date.now();
      visible = false;
      current = null;
      setTip(null);
    };
    const schedule = (target: HTMLElement) => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      current = target;
      if (visible || Date.now() - hiddenAt < SKIP_WINDOW) show(target);
      else showTimer = setTimeout(() => show(target), SHOW_DELAY);
    };

    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (ref.current?.contains(e.target as Node)) {
        clearTimeout(hideTimer);
        return;
      }
      const hovered = tooltipTarget(e.target);
      // `data-tooltip-focus-only`: the mouse gets something richer there (a peek menu).
      const target = hovered?.hasAttribute('data-tooltip-focus-only') ? null : hovered;
      if (target && target === suppressed) return;
      suppressed = null;
      if (target && target === current) {
        clearTimeout(hideTimer);
        return;
      }
      if (target) schedule(target);
      else if (visible) {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hide, HIDE_GRACE);
      } else {
        clearTimeout(showTimer);
        current = null;
      }
    };
    // Leaving the window entirely.
    const onPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) hide();
    };
    const onPointerDown = (e: PointerEvent) => {
      suppressed = tooltipTarget(e.target);
      hide();
    };
    const onFocusIn = (e: FocusEvent) => {
      const target = tooltipTarget(e.target);
      if (target && (e.target as Element).matches(':focus-visible')) show(target);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (current && tooltipTarget(e.target) === current) hide();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) hide();
    };

    document.addEventListener('pointerover', onPointerOver, true);
    document.addEventListener('pointerout', onPointerOut, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('focusin', onFocusIn, true);
    document.addEventListener('focusout', onFocusOut, true);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    window.addEventListener('blur', hide);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      document.removeEventListener('pointerover', onPointerOver, true);
      document.removeEventListener('pointerout', onPointerOut, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('focusin', onFocusIn, true);
      document.removeEventListener('focusout', onFocusOut, true);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  // Position after render, once the tooltip's size is known. It's a popover so it
  // sits in the top layer, above open dialogs and Sandpack's iframes.
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const open = node.matches(':popover-open');
    if (!tip || !tip.target.isConnected) {
      if (open) node.hidePopover();
      return;
    }
    if (!open) node.showPopover();
    const { x, y } = placeFloating(tip.target.getBoundingClientRect(), node.getBoundingClientRect(), tip.side, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
  }, [tip]);

  return (
    <div ref={ref} popover="manual" className="tooltip" aria-hidden="true">
      {tip && (
        <>
          <span>{tip.text}</span>
          {tip.kbd && <kbd className="kbd">{tip.kbd}</kbd>}
        </>
      )}
    </div>
  );
}

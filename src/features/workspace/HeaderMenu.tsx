import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';

/**
 * A "⋯" button that shows extra header actions in a small panel (the phone header has
 * no room for them). Disclosure pattern rather than role="menu": its items are ordinary
 * buttons, so Tab works inside. Closes on Esc (focus returns to the button), on a tap
 * outside, and once an item is picked.
 */
export default function HeaderMenu({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setOpen(false);
      trigger.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    // Capture: Esc must close the menu before the app's own Esc handlers see it.
    window.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const closeOnItem = (e: MouseEvent) => {
    if ((e.target as Element).closest('button')) setOpen(false);
  };

  return (
    <div className="header-menu-root" ref={root}>
      <button
        ref={trigger}
        type="button"
        className="icon-btn bordered"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div id={id} className="header-menu" role="group" aria-label={label} onClick={closeOnItem}>
          {children}
        </div>
      )}
    </div>
  );
}

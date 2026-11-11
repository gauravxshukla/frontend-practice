import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import './overlay.css';

interface ModalProps {
  open: boolean;
  /** Esc, a backdrop click, or the owner deciding to close. */
  onClose: () => void;
  labelledBy?: string;
  label?: string;
  className?: string;
  /** `top` sits in the upper third (Spotlight); `center` is a classic dialog. */
  placement?: 'center' | 'top';
  /** Focused once the dialog is open (React's autoFocus can't focus inside a closed <dialog>). */
  initialFocus?: RefObject<HTMLElement | null>;
  children: ReactNode;
}

/**
 * A modal on the native <dialog>: it sits in the top layer (above Sandpack's
 * iframes), makes the page behind it inert, traps Tab, and returns focus to
 * whatever opened it when it closes.
 */
export function Modal({ open, onClose, labelledBy, label, className = '', placement = 'center', initialFocus, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      initialFocus?.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialFocus]);

  return (
    <dialog
      ref={ref}
      className={`modal modal-${placement} ${className}`}
      aria-labelledby={labelledBy}
      aria-label={label}
      onCancel={(e) => {
        // Esc: let the owner decide (it keeps `open` in state).
        e.preventDefault();
        onClose();
      }}
      // The dialog element itself only receives clicks on its ::backdrop (the panel fills it).
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {open && children}
    </dialog>
  );
}

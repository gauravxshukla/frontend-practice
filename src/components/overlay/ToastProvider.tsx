import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { CheckCircle2, X } from 'lucide-react';
import './overlay.css';

export interface ToastInput {
  message: string;
  /** e.g. Undo. Toasts with an action are dropped on navigation, since the action belongs to the page you left. */
  action?: { label: string; run: () => void; done?: string };
  durationMs?: number;
}

interface Toast extends ToastInput {
  id: string;
  owner?: string;
}

interface ToastApi {
  show: (toast: ToastInput, owner?: string) => string;
  dismiss: (id: string) => void;
  dismissActions: (owner: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);
const MAX_TOASTS = 3;
let nextId = 0;

function ToastItem({ toast, onDismiss, onAction }: { toast: Toast; onDismiss: () => void; onAction: () => void }) {
  const remaining = useRef(toast.durationMs ?? 6000);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hovered = useRef(false);
  const focused = useRef(false);

  // Paused while hovered, focused or the tab is hidden, so nobody misses their Undo.
  const sync = useCallback(() => {
    const paused = hovered.current || focused.current || document.hidden;
    clearTimeout(timer.current);
    if (paused) {
      if (startedAt.current) remaining.current -= Date.now() - startedAt.current;
      startedAt.current = 0;
    } else {
      startedAt.current = Date.now();
      timer.current = setTimeout(onDismiss, Math.max(remaining.current, 0));
    }
  }, [onDismiss]);

  useEffect(() => {
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [sync]);

  const set = (ref: { current: boolean }, value: boolean) => () => {
    if (ref.current === value) return;
    // Bank the elapsed time before the state flips.
    if (value && startedAt.current) {
      remaining.current -= Date.now() - startedAt.current;
      startedAt.current = 0;
    }
    ref.current = value;
    sync();
  };

  return (
    <li
      className="toast"
      onPointerEnter={set(hovered, true)}
      onPointerLeave={set(hovered, false)}
      onFocus={set(focused, true)}
      onBlur={set(focused, false)}
    >
      <CheckCircle2 size={15} className="toast-icon" aria-hidden />
      <span className="toast-message">
        {toast.message}
        {toast.action && <span className="sr-only">. {toast.action.label} available.</span>}
      </span>
      {toast.action && (
        <button type="button" className="toast-action" onClick={onAction}>
          {toast.action.label}
        </button>
      )}
      <button type="button" className="icon-btn toast-close" aria-label="Dismiss" onClick={onDismiss}>
        <X size={14} />
      </button>
    </li>
  );
}

/** Small notices at the bottom of the screen, optionally with one action (Undo). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const location = useLocation();
  const firstLocation = useRef(location.key);

  const dismiss = useCallback((id: string) => setToasts((ts) => ts.filter((t) => t.id !== id)), []);
  const show = useCallback((toast: ToastInput, owner?: string) => {
    const id = `toast-${++nextId}`;
    setToasts((ts) => [...ts, { ...toast, id, owner }].slice(-MAX_TOASTS));
    return id;
  }, []);
  const dismissActions = useCallback(
    (owner: string) => setToasts((ts) => ts.filter((t) => !(t.owner === owner && t.action))),
    [],
  );

  // Navigating (including ?platform) makes any Undo point at a page you've left.
  useEffect(() => {
    if (location.key === firstLocation.current) return;
    firstLocation.current = location.key;
    setToasts((ts) => ts.filter((t) => !t.action));
  }, [location.key]);

  const api = useMemo(() => ({ show, dismiss, dismissActions }), [show, dismiss, dismissActions]);

  const runAction = (toast: Toast) => {
    if (!toast.action) return;
    dismiss(toast.id);
    toast.action.run();
    if (toast.action.done) show({ message: toast.action.done, durationMs: 2000 });
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <section className="toast-region" aria-label="Notifications">
        <ol aria-live="polite">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} onAction={() => runAction(t)} />
          ))}
        </ol>
      </section>
    </ToastContext.Provider>
  );
}

/**
 * `show` a toast owned by the calling component: if it unmounts, its action
 * toasts go too, because their Undo would act on state that no longer exists.
 */
export function useToast() {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside <ToastProvider>');
  const owner = useId();
  const { show, dismiss, dismissActions } = api;

  useEffect(() => () => dismissActions(owner), [dismissActions, owner]);

  return useMemo(() => ({ show: (toast: ToastInput) => show(toast, owner), dismiss }), [show, dismiss, owner]);
}

import { createContext, useCallback, useContext, useId, useRef, useState, type ReactNode } from 'react';
import { Modal } from './Modal';

export interface ConfirmOptions {
  title: string;
  body?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

/** Hosts the app's one confirm dialog; `useConfirm()` opens it and resolves with the answer. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((answer: boolean) => void) | null>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const confirm = useCallback<Confirm>((next) => {
    // A second request while one is open cancels the first.
    resolveRef.current?.(false);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setOptions(next);
    });
  }, []);

  const settle = (answer: boolean) => {
    resolveRef.current?.(answer);
    resolveRef.current = null;
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal open={options !== null} onClose={() => settle(false)} labelledBy={titleId} initialFocus={confirmRef} className="confirm">
        {options && (
          <div className="modal-panel confirm-panel">
            <h2 id={titleId} className="confirm-title">
              {options.title}
            </h2>
            {options.body && <div className="confirm-body">{options.body}</div>}
            <div className="confirm-actions">
              <button type="button" className="btn" onClick={() => settle(false)}>
                {options.cancelLabel ?? 'Cancel'}
              </button>
              <button
                ref={confirmRef}
                type="button"
                className={`btn ${options.tone === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => settle(true)}
              >
                {options.confirmLabel}
                <kbd className="kbd kbd-on-accent" aria-hidden>
                  ↵
                </kbd>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): Confirm {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used inside <ConfirmProvider>');
  return confirm;
}

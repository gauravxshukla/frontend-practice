import { useId, useRef } from 'react';
import { X } from 'lucide-react';
import { Modal } from '../../components/overlay/Modal';
import { displayCombo, shortcutGroups, whereLabel, type ShortcutContext } from '../../lib/shortcuts';
import './shortcuts.css';

interface Props {
  open: boolean;
  onClose: () => void;
  /** What kind of page is open: its shortcuts come first, the rest are dimmed. */
  context: ShortcutContext;
}

/** Every keyboard shortcut, grouped, with the ones that work on this page first. */
export default function KeyboardShortcuts({ open, onClose, context }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="shortcuts" initialFocus={closeRef}>
      <div className="modal-panel shortcuts-panel">
        <header className="shortcuts-header">
          <h2 id={titleId}>Keyboard shortcuts</h2>
          <button ref={closeRef} type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </button>
        </header>
        <div className="shortcuts-body">
          {shortcutGroups(context).map(({ group, items, here }) => (
            <section key={group} className={`shortcuts-group${here ? '' : ' elsewhere'}`} aria-labelledby={`${titleId}-${group}`}>
              <h3 id={`${titleId}-${group}`}>{group}</h3>
              <dl>
                {items.map((s) => (
                  <div key={s.id} className={`shortcuts-row${s.here ? '' : ' elsewhere'}`}>
                    <dt>
                      {s.label}
                      {!s.here && <span className="shortcuts-where">{whereLabel(s.where)}</span>}
                    </dt>
                    <dd>
                      {s.keys.map((combo, i) => (
                        <span key={i} className="shortcuts-combo">
                          {i > 0 && <span className="shortcuts-or">or</span>}
                          {displayCombo(combo).map((k) => (
                            <kbd key={k} className="kbd">
                              {k}
                            </kbd>
                          ))}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
        <footer className="shortcuts-footer">
          Press <kbd className="kbd">?</kbd> anywhere to open this list.
        </footer>
      </div>
    </Modal>
  );
}

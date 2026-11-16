import { useRef, type KeyboardEvent } from 'react';
import { PANE_LABELS, stepPane, type PaneKey, type PhonePane } from './phonePanes';

interface Props {
  panes: PhonePane[];
  value: PhonePane;
  onChange: (pane: PhonePane) => void;
  /** Panes that need attention (e.g. the console has errors): a dot on their tab. */
  alerts?: Partial<Record<PhonePane, boolean>>;
}

const KEYS = new Set<string>(['ArrowLeft', 'ArrowRight', 'Home', 'End']);

/** Phone question page: switches between the problem, the editor and the output, one at a time. */
export default function PhonePaneTabs({ panes, value, onChange, alerts = {} }: Props) {
  const tabs = useRef(new Map<PhonePane, HTMLButtonElement>());

  const onKeyDown = (e: KeyboardEvent) => {
    if (!KEYS.has(e.key)) return;
    e.preventDefault();
    const next = stepPane(panes, value, e.key as PaneKey);
    onChange(next);
    tabs.current.get(next)?.focus();
  };

  return (
    <div className="phone-panes" role="tablist" aria-label="View" onKeyDown={onKeyDown}>
      {panes.map((pane) => (
        <button
          key={pane}
          ref={(el) => {
            if (el) tabs.current.set(pane, el);
            else tabs.current.delete(pane);
          }}
          type="button"
          role="tab"
          aria-selected={pane === value}
          tabIndex={pane === value ? 0 : -1}
          onClick={() => onChange(pane)}
        >
          {PANE_LABELS[pane]}
          {alerts[pane] && (
            <>
              <span className="tab-dot phone-pane-alert" aria-hidden />
              <span className="sr-only"> (console has errors)</span>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

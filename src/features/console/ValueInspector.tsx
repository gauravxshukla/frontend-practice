import { useState, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { InspectValue } from './types';
import { isExpandable, previewOf } from './preview';

/** Children rendered per "Show more" click, so a 10k-item array doesn't render at once. */
const PAGE = 100;

interface Child {
  key: string;
  label: string;
  value: InspectValue;
}

function childrenOf(v: InspectValue): Child[] {
  switch (v.t) {
    case 'array':
    case 'set':
      return v.items.map((value, i) => ({ key: String(i), label: String(i), value }));
    case 'map':
      return v.entries.map(([k, value], i) => ({ key: String(i), label: previewOf(k, 40), value }));
    case 'object':
      return v.entries.map(([k, value]) => ({ key: k, label: k, value }));
    default:
      return [];
  }
}

/** CSS hook for syntax colouring: `iv-string`, `iv-number`, `iv-fn`… */
function toneOf(v: InspectValue, top: boolean): string {
  if (v.t === 'prim') return top && v.type === 'string' ? 'iv-text' : `iv-${v.type}`;
  return `iv-${v.t}`;
}

interface ValueInspectorProps {
  value: InspectValue;
  /** Property name, index or map key shown before the value. */
  label?: string;
  separator?: string;
  /** A value logged directly: strings print without quotes. */
  top?: boolean;
}

/** DevTools-style value: a one-line preview that expands into a lazily rendered tree. */
export default function ValueInspector({ value, label, separator = ': ', top = false }: ValueInspectorProps) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(PAGE);

  const labelEl: ReactNode = label !== undefined && (
    <span className="iv-key">
      {label}
      {separator}
    </span>
  );
  const summary = <span className={toneOf(value, top)}>{previewOf(value, 80, top)}</span>;

  if (!isExpandable(value)) {
    return (
      <span className="iv-leaf">
        {labelEl}
        {summary}
      </span>
    );
  }

  const children = childrenOf(value);
  const notCaptured = 'more' in value ? value.more : undefined;

  return (
    <div className="iv-node" data-open={open || undefined}>
      <button type="button" className="iv-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <ChevronRight size={12} className="iv-caret" aria-hidden />
        {labelEl}
        {summary}
      </button>
      {open &&
        (value.t === 'error' ? (
          <pre className="iv-stack">{value.stack}</pre>
        ) : (
          <div className="iv-children" role="group">
            {children.slice(0, shown).map((child) => (
              <div key={child.key} className="iv-child">
                <ValueInspector value={child.value} label={child.label} separator={value.t === 'map' ? ' => ' : ': '} />
              </div>
            ))}
            {children.length > shown && (
              <button type="button" className="iv-more" onClick={() => setShown((n) => n + PAGE)}>
                Show {Math.min(PAGE, children.length - shown)} more of {children.length - shown}…
              </button>
            )}
            {notCaptured ? <div className="iv-note">… {notCaptured} more not captured</div> : null}
          </div>
        ))}
    </div>
  );
}

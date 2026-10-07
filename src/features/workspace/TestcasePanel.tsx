import { Plus, RotateCcw, X } from 'lucide-react';
import type { DsaCase, DsaSpec } from '../../lib/content/catalog';

/** A visible testcase as editable JSON text, one field per parameter. */
export interface EditableCase {
  fields: string[];
  /** The case from cases.json it started as; dropped once edited (expected is then recomputed). */
  original?: DsaCase;
}

export function fieldNames(spec: DsaSpec) {
  return (spec.kind ?? 'function') === 'design' ? ['operations', 'arguments'] : (spec.params ?? []).map((p) => p.name);
}

export function toEditable(spec: DsaSpec, kase: DsaCase): EditableCase {
  const fields =
    (spec.kind ?? 'function') === 'design'
      ? [JSON.stringify(kase.input[0]), JSON.stringify(kase.input[1])]
      : kase.input.map((v) => JSON.stringify(v));
  return { fields, original: kase };
}

/** Parses an editable case back into a runnable one; throws with a readable message on bad JSON. */
export function toRunnable(spec: DsaSpec, ec: EditableCase): DsaCase {
  if (ec.original) return ec.original;
  const names = fieldNames(spec);
  const values = ec.fields.map((text, i) => {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`"${names[i]}" isn't valid JSON`);
    }
  });
  return { input: values };
}

interface DsaTestcaseProps {
  spec: DsaSpec;
  cases: EditableCase[];
  selected: number;
  onSelect: (i: number) => void;
  onChange: (cases: EditableCase[]) => void;
  onReset: () => void;
  error?: string;
}

export function DsaTestcasePanel({ spec, cases, selected, onSelect, onChange, onReset, error }: DsaTestcaseProps) {
  const names = fieldNames(spec);
  const current = cases[selected];
  const edited = cases.some((c) => !c.original);

  const updateField = (fieldIndex: number, text: string) => {
    onChange(
      cases.map((c, i) =>
        i === selected ? { fields: c.fields.map((f, j) => (j === fieldIndex ? text : f)) } : c,
      ),
    );
  };

  return (
    <div className="testcase-panel">
      <div className="case-chips" role="tablist" aria-label="Testcases">
        {cases.map((c, i) => (
          <div key={i} className={`case-chip${i === selected ? ' active' : ''}`}>
            <button type="button" role="tab" aria-selected={i === selected} onClick={() => onSelect(i)}>
              Case {i + 1}
              {!c.original && <span className="edited-dot" title="Edited: expected output comes from the reference solution" />}
            </button>
            {cases.length > 1 && (
              <button
                type="button"
                className="chip-remove"
                aria-label={`Remove case ${i + 1}`}
                onClick={() => {
                  onChange(cases.filter((_, j) => j !== i));
                  onSelect(Math.max(0, Math.min(selected, cases.length - 2)));
                }}
              >
                <X size={11} />
              </button>
            )}
          </div>
        ))}
        {cases.length < 8 && (
          <button
            type="button"
            className="icon-btn chip-add"
            aria-label="Add testcase"
            title="Add a testcase (copies the current one)"
            onClick={() => {
              onChange([...cases, { fields: [...current.fields] }]);
              onSelect(cases.length);
            }}
          >
            <Plus size={14} />
          </button>
        )}
        {edited && (
          <button type="button" className="btn btn-ghost btn-sm reset-cases" onClick={onReset}>
            <RotateCcw size={12} aria-hidden /> Reset testcases
          </button>
        )}
      </div>

      {current && (
        <div className="case-fields">
          {names.map((name, i) => (
            <label key={name} className="case-field">
              <span className="case-field-label">{name} =</span>
              <textarea
                spellCheck={false}
                rows={Math.min(6, Math.max(1, Math.ceil(current.fields[i].length / 70)))}
                value={current.fields[i]}
                onChange={(e) => updateField(i, e.target.value)}
              />
            </label>
          ))}
        </div>
      )}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function JsTestcasePanel({ runNames, total }: { runNames: string[]; total: number }) {
  return (
    <div className="testcase-panel">
      <p className="muted panel-hint">
        <strong>Run</strong> executes these {runNames.length} example tests. <strong>Submit</strong> runs all {total}.
      </p>
      <ul className="test-name-list">
        {runNames.map((name) => (
          <li key={name}>
            <code>{name}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}

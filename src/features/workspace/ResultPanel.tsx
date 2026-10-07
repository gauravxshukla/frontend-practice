import { useEffect, useState, type ReactNode } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import type { CaseResult } from '../runner/runJob';
import type { Verdict } from '../runner/verdict';

function Field({ label, children, tone }: { label: string; children: ReactNode; tone?: 'bad' | 'good' }) {
  return (
    <div className="result-field">
      <div className="result-field-label">{label}</div>
      <div className={`result-field-value${tone ? ` tone-${tone}` : ''}`}>{children}</div>
    </div>
  );
}

function CaseDetail({ result }: { result: CaseResult }) {
  return (
    <div className="case-detail">
      {result.name && <Field label="Test">{result.name}</Field>}
      {result.input && (
        <Field label={result.hidden ? 'Input (hidden testcase)' : 'Input'}>
          {result.input.map((p) => (
            <div key={p.name} className="input-row">
              <span className="input-name">{p.name} =</span> {p.value}
            </div>
          ))}
        </Field>
      )}
      {result.stdout.length > 0 && <Field label="Stdout">{result.stdout.join('\n')}</Field>}
      {result.failure && (
        <Field label="Failed expectation" tone="bad">
          {result.failure}
        </Field>
      )}
      {result.error ? (
        <Field label={result.error.line ? `Error · line ${result.error.line}` : 'Error'} tone="bad">
          {result.error.message}
        </Field>
      ) : (
        <>
          {result.output !== undefined && (
            <Field label="Output" tone={result.passed === false ? 'bad' : undefined}>
              {result.output}
            </Field>
          )}
          {result.expected !== undefined && <Field label="Expected" tone={result.passed === false ? 'good' : undefined}>{result.expected}</Field>}
        </>
      )}
    </div>
  );
}

interface ResultPanelProps {
  mode: 'run' | 'submit';
  verdict: Verdict | null;
  running: boolean;
}

export default function ResultPanel({ mode, verdict, running }: ResultPanelProps) {
  const [selected, setSelected] = useState(0);
  useEffect(() => setSelected(0), [verdict]);

  if (running) {
    return (
      <div className="result-empty">
        <Loader2 className="spin" size={16} aria-hidden /> {mode === 'submit' ? 'Judging against all testcases…' : 'Running…'}
      </div>
    );
  }
  if (!verdict) {
    return <div className="result-empty muted">Run your code to see results here.</div>;
  }

  const { results } = verdict;
  // Submit shows the first failing case like LeetCode; Run lets you flip through every case.
  const focus = mode === 'submit' ? verdict.firstFailure : results[selected];

  return (
    <div className="result-panel" aria-live="polite">
      <div className="verdict">
        <h3 className={`verdict-title verdict-${verdict.kind}`}>{verdict.title}</h3>
        {verdict.detail && <span className="muted">{verdict.detail}</span>}
      </div>

      {verdict.message && !results.length && <pre className="verdict-message">{verdict.message}</pre>}

      {mode === 'run' && results.length > 0 && (
        <div className="case-chips" role="tablist" aria-label="Results">
          {results.map((r, i) => (
            <div key={i} className={`case-chip${i === selected ? ' active' : ''}`}>
              <button type="button" role="tab" aria-selected={i === selected} onClick={() => setSelected(i)}>
                {r.passed === true && <Check size={12} className="tone-good" aria-label="passed" />}
                {r.passed === false && <X size={12} className="tone-bad" aria-label="failed" />}
                {r.name ? `Test ${i + 1}` : `Case ${i + 1}`}
              </button>
            </div>
          ))}
        </div>
      )}

      {mode === 'submit' && verdict.kind === 'accepted' && (
        <p className="accepted-note">All testcases passed, including the hidden edge cases. Marked as solved.</p>
      )}

      {focus && <CaseDetail result={focus} />}
    </div>
  );
}

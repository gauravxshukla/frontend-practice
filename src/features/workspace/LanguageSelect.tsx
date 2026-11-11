import { LANGUAGES } from '../runner/languages/registry';
import type { LanguageId } from '../runner/languages/types';

interface LanguageSelectProps {
  value: LanguageId;
  onChange: (id: LanguageId) => void;
  disabled?: boolean;
}

/** Native select: keyboard and screen-reader behaviour for free. */
export default function LanguageSelect({ value, onChange, disabled }: LanguageSelectProps) {
  return (
    <select
      className="language-select"
      aria-label="Language"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as LanguageId)}
    >
      {LANGUAGES.map((l) => (
        <option key={l.id} value={l.id}>
          {l.label}
        </option>
      ))}
    </select>
  );
}

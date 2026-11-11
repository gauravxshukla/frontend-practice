import { Select } from '../../components/Select';
import { LANGUAGES } from '../runner/languages/registry';
import type { LanguageId } from '../runner/languages/types';

interface LanguageSelectProps {
  value: LanguageId;
  onChange: (id: LanguageId) => void;
  disabled?: boolean;
}

/** The DSA language picker. */
export default function LanguageSelect({ value, onChange, disabled }: LanguageSelectProps) {
  return (
    <Select
      className="language-select"
      aria-label="Language"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as LanguageId)}
    >
      {LANGUAGES.map((l) => (
        <option key={l.id} value={l.id}>
          {l.label}
          {l.beta ? ' (beta)' : ''}
        </option>
      ))}
    </Select>
  );
}

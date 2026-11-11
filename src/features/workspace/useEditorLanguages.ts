import { useEffect, useMemo, useState } from 'react';
import type { CustomLanguage } from '@codesandbox/sandpack-react';
import type { LanguageId } from '../runner/languages/types';

// Sandpack's editor highlights JS/CSS/HTML out of the box. Python's grammar is
// fetched only when someone actually picks Python, and kept for the session.
let python: CustomLanguage | null = null;

/** Extra CodeMirror languages for the editor; empty until the grammar has loaded. */
export function useEditorLanguages(language: LanguageId): CustomLanguage[] {
  const [loaded, setLoaded] = useState(python);

  useEffect(() => {
    if (language !== 'python' || loaded) return;
    let cancelled = false;
    import('@codemirror/lang-python').then((mod) => {
      python ??= { name: 'python', extensions: ['py'], language: mod.python() };
      if (!cancelled) setLoaded(python);
    });
    return () => {
      cancelled = true;
    };
  }, [language, loaded]);

  return useMemo(() => (loaded ? [loaded] : []), [loaded]);
}

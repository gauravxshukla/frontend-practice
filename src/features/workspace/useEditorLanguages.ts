import { useEffect, useMemo, useState } from 'react';
import type { CustomLanguage } from '@codesandbox/sandpack-react';
import type { LanguageId } from '../runner/languages/types';

// Sandpack's editor highlights JS/CSS/HTML out of the box. Other grammars are
// fetched only when someone actually picks that language, and kept for the session.
const GRAMMARS: Partial<Record<LanguageId, () => Promise<CustomLanguage>>> = {
  python: () => import('@codemirror/lang-python').then((m) => ({ name: 'python', extensions: ['py'], language: m.python() })),
  java: () => import('@codemirror/lang-java').then((m) => ({ name: 'java', extensions: ['java'], language: m.java() })),
};

const loaded = new Map<LanguageId, CustomLanguage>();

/** Extra CodeMirror languages for the editor; empty until the grammar has loaded. */
export function useEditorLanguages(language: LanguageId): CustomLanguage[] {
  const [grammar, setGrammar] = useState(() => loaded.get(language) ?? null);

  useEffect(() => {
    const cached = loaded.get(language);
    if (cached) {
      setGrammar(cached);
      return;
    }
    const load = GRAMMARS[language];
    if (!load) return;
    let cancelled = false;
    load().then((g) => {
      loaded.set(language, g);
      if (!cancelled) setGrammar(g);
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  // Every grammar loaded so far: switching language reuses the same editor. Recomputed when one arrives.
  return useMemo(() => [...loaded.values()], [grammar]);
}

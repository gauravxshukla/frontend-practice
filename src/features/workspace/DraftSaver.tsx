import { useEffect } from 'react';
import { useSandpack } from '@codesandbox/sandpack-react';
import { saveDraft } from '../../lib/drafts';

/** Persists the given Sandpack files as a draft for `slug` (debounced). */
export default function DraftSaver({ slug, paths }: { slug: string; paths: string[] }) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    const id = setTimeout(() => {
      const draft = Object.fromEntries(
        paths.filter((p) => sandpack.files[p]).map((p) => [p, sandpack.files[p].code]),
      );
      saveDraft(slug, draft);
    }, 400);
    return () => clearTimeout(id);
  }, [sandpack.files, slug, paths]);

  return null;
}

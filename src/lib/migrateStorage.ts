import jsTopics from '../../content/js/topics.json';

// Question slugs are folder paths, so moving JS questions into topic folders
// (js/debounce → js/functions-closures/debounce) would orphan saved drafts and
// progress. This runs once per browser, before the stores read localStorage.
const DONE_KEY = 'fp:migrated:js-topics';

function renames(): [string, string][] {
  return (jsTopics as { id: string; problems: string[] }[]).flatMap((t) =>
    t.problems.map((p) => [`js/${p}`, `js/${t.id}/${p}`] as [string, string]),
  );
}

try {
  if (!localStorage.getItem(DONE_KEY)) {
    const progress = JSON.parse(localStorage.getItem('fp:progress') ?? '{}') as Record<string, string>;
    for (const [from, to] of renames()) {
      if (from in progress) {
        progress[to] ??= progress[from];
        delete progress[from];
      }
      const draft = localStorage.getItem(`fp:draft:${from}`);
      if (draft !== null) {
        if (localStorage.getItem(`fp:draft:${to}`) === null) localStorage.setItem(`fp:draft:${to}`, draft);
        localStorage.removeItem(`fp:draft:${from}`);
      }
    }
    localStorage.setItem('fp:progress', JSON.stringify(progress));
    localStorage.setItem(DONE_KEY, '1');
  }
} catch {
  // Storage unavailable: nothing to migrate.
}

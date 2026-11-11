import { findGroup, questions, type Question, type QuestionGroup } from './content/catalog';

// Every app URL is built and parsed here, so links stay guessable and consistent:
//   /dsa/two-sum · /js/debounce · /react/data-table · /react/like-button/native
//   /js · /dsa · /machine-coding (tracks) · /dsa/topics/trees · /react · /vanilla (topics)
//   /quiz/<deck> · /notes/<path>
// Question names (the last folder of a question's slug) are unique across the catalog.

type Platform = 'web' | 'native';

/** URL segment for a question's track: its type, so React and Vanilla are tracks of their own. */
export const ROUTE_TRACKS: Question['type'][] = ['js', 'dsa', 'react', 'vanilla'];
const routeTrackOf = (q: Question) => q.type;

const leafOf = (slug: string) => slug.slice(slug.lastIndexOf('/') + 1);

const byTrackAndName = new Map(questions.map((q) => [`${routeTrackOf(q)}/${leafOf(q.slug)}`, q]));

export function questionUrl(q: Question, platform: Platform = 'web'): string {
  const path = `/${routeTrackOf(q)}/${leafOf(q.slug)}`;
  return platform === 'native' && q.type === 'react' ? `${path}/native` : path;
}

/** Question by the URL's track and name, e.g. ('dsa', 'two-sum'). */
export function findQuestion(track: string, name: string): Question | undefined {
  return byTrackAndName.get(`${track}/${name}`);
}

/** Group ids: `js`, `dsa/trees`, `machine-coding`, `machine-coding/react`. */
export function groupUrl(groupId: string): string {
  if (groupId.startsWith('machine-coding/')) return `/${groupId.slice('machine-coding/'.length)}`;
  const [track, ...topic] = groupId.split('/');
  return topic.length ? `/${track}/topics/${topic.join('/')}` : `/${track}`;
}

export const quizUrl = (deck?: string) => (deck ? `/quiz/${deck}` : '/quiz');
export const notesUrl = (slug?: string) => (slug ? `/notes/${slug}` : '/notes');

export type Route =
  | { kind: 'home' }
  | { kind: 'group'; group: QuestionGroup }
  | { kind: 'question'; question: Question; platform: Platform }
  | { kind: 'quiz'; deck?: string }
  | { kind: 'notes'; slug?: string }
  | { kind: 'unknown'; track?: string; name?: string };

/** What a pathname points at (the inverse of the builders above). */
export function parseRoute(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return { kind: 'home' };
  const [first, ...rest] = parts;
  if (first === 'quiz') return { kind: 'quiz', deck: rest[0] };
  if (first === 'notes') return { kind: 'notes', slug: rest.join('/') || undefined };

  const groupId = first === 'react' || first === 'vanilla' ? `machine-coding/${first}` : first;
  if (!rest.length) {
    const group = findGroup(groupId);
    return group ? { kind: 'group', group } : { kind: 'unknown' };
  }
  if ((first === 'js' || first === 'dsa') && rest[0] === 'topics' && rest.length === 2) {
    const group = findGroup(`${first}/${rest[1]}`);
    return group ? { kind: 'group', group } : { kind: 'unknown', track: first };
  }
  const question = findQuestion(first, rest[0]);
  if (question && rest.length === 1) return { kind: 'question', question, platform: 'web' };
  if (question && rest.length === 2 && rest[1] === 'native' && question.type === 'react') {
    return { kind: 'question', question, platform: 'native' };
  }
  return { kind: 'unknown', track: first, name: rest[0] };
}

/** Where an old-style URL lives now: `/q/<slug>[?platform=native]` and `/topics/<group>`. */
export function legacyRedirect(pathname: string, search = ''): string | null {
  if (pathname.startsWith('/q/')) {
    const question = questions.find((q) => q.slug === pathname.slice(3).replace(/\/$/, ''));
    if (!question) return null;
    const platform = new URLSearchParams(search).get('platform') === 'native' ? 'native' : 'web';
    return questionUrl(question, platform);
  }
  if (pathname.startsWith('/topics/')) {
    const group = findGroup(pathname.slice('/topics/'.length).replace(/\/$/, ''));
    return group ? groupUrl(group.id) : null;
  }
  return null;
}

import { Link, useParams } from 'react-router';
import Markdown from '../../components/Markdown';
import { getNote, getNoteSection, noteSections, type NoteSection } from '../../lib/content/notes';

function SectionList({ section }: { section: NoteSection }) {
  return (
    <ul className="question-list">
      {section.notes.map((n) => (
        <li key={n.slug}>
          <Link to={`/notes/${n.slug}`} className="question-row">
            <span className="question-row-title">{n.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function NotesIndex({ only }: { only?: NoteSection }) {
  return (
    <div className="page">
      <header className="page-header">
        {only && (
          <p className="eyebrow">
            <Link to="/notes">Notes</Link>
          </p>
        )}
        <h1>{only ? only.label : 'Notes'}</h1>
        <p className="muted">Read-only reference material.</p>
      </header>
      {(only ? [only] : noteSections).map((section) => (
        <section key={section.id} className="catalog-section">
          {!only && <h2>{section.label}</h2>}
          <SectionList section={section} />
        </section>
      ))}
    </div>
  );
}

export default function NotesPage() {
  const slug = useParams()['*'] ?? '';
  const note = getNote(slug);

  if (!slug) return <NotesIndex />;
  const section = getNoteSection(slug);
  if (section) return <NotesIndex only={section} />;
  if (!note) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Note not found</h2>
          <Link to="/notes">Back to notes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <p className="eyebrow">
        <Link to="/notes">Notes</Link> / <Link to={`/notes/${note.sectionId}`}>{note.section}</Link>
      </p>
      <article className="prose">
        <Markdown>{note.content}</Markdown>
      </article>
    </div>
  );
}

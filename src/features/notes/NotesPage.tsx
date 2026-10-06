import { Link, useParams } from 'react-router';
import Markdown from '../../components/Markdown';
import { getNote, notes } from '../../lib/content/notes';

function NotesIndex() {
  const sections = [...new Set(notes.map((n) => n.section))];
  return (
    <div className="page">
      <header className="page-header">
        <h1>Notes</h1>
        <p className="muted">Read-only reference material.</p>
      </header>
      {sections.map((section) => (
        <section key={section} className="catalog-section">
          <h2>{section}</h2>
          <ul className="question-list">
            {notes
              .filter((n) => n.section === section)
              .map((n) => (
                <li key={n.slug}>
                  <Link to={`/notes/${n.slug}`} className="question-row">
                    <span className="question-row-title">{n.title}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function NotesPage() {
  const slug = useParams()['*'] ?? '';
  const note = getNote(slug);

  if (!slug) return <NotesIndex />;
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
        <Link to="/notes">Notes</Link> / {note.section}
      </p>
      <article className="prose">
        <Markdown>{note.content}</Markdown>
      </article>
    </div>
  );
}

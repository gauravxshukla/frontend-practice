import { Link } from 'react-router';
import { quizDecks } from '../../lib/content/quiz';

export default function QuizIndex() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Quiz</h1>
        <p className="muted">Predict the output or answer out loud, then reveal.</p>
      </header>
      <ul className="question-list">
        {quizDecks.map((deck) => {
          // Decks whose cards show a snippet up front are output-prediction drills.
          const isOutput = deck.cards.some((c) => c.front);
          return (
            <li key={deck.slug}>
              <Link to={`/quiz/${deck.slug}`} className="question-row">
                <span className="question-row-title">{deck.title}</span>
                <span className="tag">{isOutput ? 'Predict output' : 'Theory'}</span>
                <span className="muted question-row-meta">{deck.cards.length} cards</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

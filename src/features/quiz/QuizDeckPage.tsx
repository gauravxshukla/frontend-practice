import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Eye, EyeOff, Shuffle } from 'lucide-react';
import Markdown from '../../components/Markdown';
import { getDeck, type QuizCard } from '../../lib/content/quiz';

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function Card({ card, index, revealed, onToggle }: { card: QuizCard; index: number; revealed: boolean; onToggle: () => void }) {
  return (
    <article className={`quiz-card${revealed ? ' revealed' : ''}`}>
      <h2>
        <span className="quiz-index">{String(index + 1).padStart(2, '0')}</span>
        {card.title}
      </h2>
      {card.front && <Markdown>{card.front}</Markdown>}
      <button type="button" className="btn btn-sm" onClick={onToggle} aria-expanded={revealed}>
        {revealed ? <EyeOff size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
        {revealed ? 'Hide answer' : card.front ? 'Reveal answer' : 'Show answer'}
      </button>
      {revealed && (
        <div className="quiz-answer">
          <Markdown>{card.back}</Markdown>
        </div>
      )}
    </article>
  );
}

export default function QuizDeckPage() {
  const deck = getDeck(useParams().deck ?? '');
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  // Cards are keyed by their index in the original deck, so shuffling keeps reveal state.
  const order = useMemo(() => {
    const indices = deck ? deck.cards.map((_, i) => i) : [];
    return shuffleSeed ? shuffle(indices) : indices;
  }, [deck, shuffleSeed]);

  if (!deck) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Deck not found</h2>
          <Link to="/quiz">Back to quiz</Link>
        </div>
      </div>
    );
  }

  const toggle = (i: number) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const allRevealed = revealed.size === deck.cards.length;
  const progress = Math.round((revealed.size / deck.cards.length) * 100);

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">
          <Link to="/quiz">Quiz</Link>
        </p>
        <h1>{deck.title}</h1>
      </header>

      <div className="toolbar sticky-toolbar">
        <div className="progress" aria-label={`${revealed.size} of ${deck.cards.length} revealed`}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="muted">
            {revealed.size} / {deck.cards.length} revealed
          </span>
        </div>
        <div className="segmented">
          <button type="button" aria-pressed={shuffleSeed > 0} className={shuffleSeed ? 'active' : ''} onClick={() => setShuffleSeed((s) => (s ? 0 : Date.now()))}>
            <Shuffle size={13} aria-hidden /> {shuffleSeed ? 'Shuffled' : 'Shuffle'}
          </button>
          <button
            type="button"
            onClick={() => setRevealed(allRevealed ? new Set() : new Set(deck.cards.map((_, i) => i)))}
          >
            {allRevealed ? <EyeOff size={13} aria-hidden /> : <Eye size={13} aria-hidden />}
            {allRevealed ? 'Hide all' : 'Reveal all'}
          </button>
        </div>
      </div>

      <div className="quiz-list">
        {order.map((cardIndex, position) => (
          <Card
            key={cardIndex}
            card={deck.cards[cardIndex]}
            index={position}
            revealed={revealed.has(cardIndex)}
            onToggle={() => toggle(cardIndex)}
          />
        ))}
      </div>
    </div>
  );
}

import { Link } from 'react-router';
import { ArrowRight, CircleCheckBig } from 'lucide-react';
import type { QuestionGroup } from '../../lib/content/catalog';
import { TRACK_ICONS } from '../../lib/icons';
import type { Status } from '../../lib/progress';
import { groupUrl, questionUrl } from '../../lib/routes';
import { trackSummary } from '../../lib/stats';

const BLURBS: Record<string, string> = {
  js: 'Polyfills, utilities and async patterns, graded by tests.',
  dsa: 'The NeetCode 150, topic by topic, with hidden edge cases.',
  'machine-coding': 'Build UI in React or vanilla JS with a live preview.',
};

interface Props {
  tracks: QuestionGroup[];
  progress: Record<string, Status>;
  touched: Record<string, number>;
}

/** One card per track: progress, and a button straight to the next question. */
export default function TrackProgress({ tracks, progress, touched }: Props) {
  return (
    <section className="track-progress" aria-label="Tracks">
      {tracks.map((track) => {
        const Icon = TRACK_ICONS[track.id];
        const { solved, total, next, started } = trackSummary(track, progress, touched);
        const pct = total ? (solved / total) * 100 : 0;
        return (
          <article key={track.id} className="dash-card track-tile">
            <Link to={groupUrl(track.id)} className="track-tile-head">
              <span className="track-tile-icon">{Icon && <Icon size={18} aria-hidden />}</span>
              <span className="track-tile-title">{track.label}</span>
              <span className="track-tile-count">
                {solved}
                <span className="dash-muted"> / {total}</span>
              </span>
            </Link>
            <p className="dash-muted track-tile-blurb">{BLURBS[track.id]}</p>
            <span
              className="meter tone-accent"
              role="meter"
              aria-label={`${track.label} solved`}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={solved}
              aria-valuetext={`${solved} of ${total}`}
            >
              <span className="meter-fill" style={{ width: `${pct}%` }} />
            </span>
            {next ? (
              <Link to={questionUrl(next)} className="btn track-tile-next">
                <span className="track-tile-next-label">{started ? 'Continue' : 'Start'}</span>
                <span className="track-tile-next-title">{next.title}</span>
                <ArrowRight size={14} aria-hidden />
              </Link>
            ) : (
              <p className="track-tile-done">
                <CircleCheckBig size={15} aria-hidden /> All solved
              </p>
            )}
          </article>
        );
      })}
    </section>
  );
}

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  ROUNDS_PER_GAME, getRandomSynopses, parseSynopsis,
  buildSynopsisSearchIndex, searchSynopsisDramas,
} from '../data/synopses';
import './SynopsisGame.css';

function SynopsisDisplay({ synopsis, revealed }) {
  const { parts } = parseSynopsis(synopsis);

  return (
    <p className="synopsis-game__text">
      {parts.map((part, i) => {
        if (part.type === 'text') return <span key={i}>{part.text}</span>;
        const isRevealed = revealed.includes(part.index);
        return (
          <span
            key={i}
            className={`synopsis-game__blank${isRevealed ? ' synopsis-game__blank--revealed' : ''}`}
          >
            {isRevealed ? part.text : '      '}
          </span>
        );
      })}
    </p>
  );
}

function SynopsisSearch({ onGuess, disabled }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const index = useMemo(() => buildSynopsisSearchIndex(), []);

  useEffect(() => {
    if (query.length >= 1) {
      const matches = searchSynopsisDramas(query, index);
      setResults(matches);
      setOpen(matches.length > 0);
      setActiveIdx(-1);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query, index]);

  function handleSelect(drama) {
    onGuess(drama.title);
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      listRef.current.children[activeIdx]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  return (
    <div className="drama-search">
      <input
        ref={inputRef}
        type="text"
        className="drama-search__input"
        placeholder="Guess the K-drama..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        autoComplete="off"
        spellCheck="false"
        disabled={disabled}
      />
      {open && (
        <ul className="drama-search__results" ref={listRef}>
          {results.map((d, i) => (
            <li
              key={d.title}
              className={`drama-search__result${i === activeIdx ? ' drama-search__result--active' : ''}`}
              onMouseDown={() => handleSelect(d)}
              onMouseEnter={() => setActiveIdx(i)}
            >
              {d.title} <span className="drama-search__ko">{d.titleKo}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SynopsisGame() {
  const [synopses, setSynopses] = useState(() => getRandomSynopses(ROUNDS_PER_GAME));
  const [round, setRound] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('playing'); // playing | correct | wrong | finished
  const [feedback, setFeedback] = useState(null);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [roundScores, setRoundScores] = useState([]);
  const feedbackTimer = useRef(null);

  const current = synopses[round];
  const parsed = useMemo(() => parseSynopsis(current.synopsis), [current]);

  function handleReveal() {
    const nextIdx = revealed.length;
    if (nextIdx < parsed.revealOrder.length) {
      setRevealed(prev => [...prev, parsed.revealOrder[nextIdx]]);
    }
  }

  function handleGuess(title) {
    clearTimeout(feedbackTimer.current);

    if (title === current.title) {
      const blanksRemaining = parsed.totalBlanks - revealed.length;
      const pts = blanksRemaining + 1;
      setScore(s => s + pts);
      setRoundScores(prev => [...prev, { ...current, points: pts, guessCount: wrongGuesses.length + 1 }]);
      setPhase('correct');
      setFeedback({ type: 'correct', text: `+${pts} point${pts > 1 ? 's' : ''}!` });
    } else {
      setWrongGuesses(prev => [...prev, title]);
      setFeedback({ type: 'wrong', text: `Not ${title}!` });
      feedbackTimer.current = setTimeout(() => setFeedback(null), 2000);
    }
  }

  function handleSkip() {
    setRoundScores(prev => [...prev, { ...current, points: 0, guessCount: wrongGuesses.length }]);
    setRevealed(parsed.revealOrder);
    setPhase('wrong');
  }

  function handleNext() {
    setWrongGuesses([]);
    setFeedback(null);
    setRevealed([]);
    if (round + 1 >= synopses.length) {
      setPhase('finished');
    } else {
      setRound(r => r + 1);
      setPhase('playing');
    }
  }

  function handlePlayAgain() {
    setSynopses(getRandomSynopses(ROUNDS_PER_GAME));
    setRound(0);
    setRevealed([]);
    setScore(0);
    setPhase('playing');
    setFeedback(null);
    setWrongGuesses([]);
    setRoundScores([]);
  }

  const maxScore = ROUNDS_PER_GAME * 5;

  if (phase === 'finished') {
    const pct = Math.round((score / maxScore) * 100);
    return (
      <div className="synopsis-game">
        <div className="synopsis-game__final">
          <p className="synopsis-game__final-emoji">
            {pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : pct >= 40 ? '👏' : '📖'}
          </p>
          <p className="synopsis-game__final-title">
            {pct >= 80 ? 'Drama Expert!' : pct >= 60 ? 'Impressive!' : pct >= 40 ? 'Not Bad!' : 'Keep Watching!'}
          </p>
          <p className="synopsis-game__final-score">{score}/{maxScore} points</p>
        </div>

        <div className="synopsis-game__summary">
          {roundScores.map((r, i) => (
            <div key={i} className="synopsis-game__summary-row">
              <div className="synopsis-game__summary-header">
                <span className="synopsis-game__summary-title">{r.title}</span>
                <span className="synopsis-game__summary-ko">{r.titleKo}</span>
              </div>
              <span className={`synopsis-game__summary-pts${r.points === 0 ? ' synopsis-game__summary-pts--zero' : ''}`}>
                {r.points > 0 ? `+${r.points}` : 'Skipped'}
              </span>
            </div>
          ))}
        </div>

        <button className="synopsis-game__btn" onClick={handlePlayAgain}>
          Play Again
        </button>
      </div>
    );
  }

  const blanksLeft = parsed.totalBlanks - revealed.length;
  const canReveal = revealed.length < parsed.revealOrder.length && phase === 'playing';

  return (
    <div className="synopsis-game">
      <div className="synopsis-game__round">
        Round {round + 1}/{ROUNDS_PER_GAME}
      </div>

      <div className="synopsis-game__card">
        <div className="synopsis-game__hint-count">
          {blanksLeft} blank{blanksLeft !== 1 ? 's' : ''} remaining — {blanksLeft + 1} pt{blanksLeft + 1 !== 1 ? 's' : ''} if correct
        </div>
        <SynopsisDisplay synopsis={current.synopsis} revealed={revealed} />

        {phase === 'correct' && (
          <div className="synopsis-game__answer synopsis-game__answer--correct">
            {current.title} <span className="synopsis-game__answer-ko">{current.titleKo}</span>
          </div>
        )}
        {phase === 'wrong' && (
          <div className="synopsis-game__answer synopsis-game__answer--wrong">
            {current.title} <span className="synopsis-game__answer-ko">{current.titleKo}</span>
          </div>
        )}
      </div>

      {feedback && (
        <div
          key={feedback.text}
          className={`synopsis-game__feedback synopsis-game__feedback--${feedback.type}`}
        >
          {feedback.text}
        </div>
      )}

      {wrongGuesses.length > 0 && phase === 'playing' && (
        <div className="synopsis-game__wrong-list">
          {wrongGuesses.map(g => (
            <span key={g} className="synopsis-game__wrong-chip">{g}</span>
          ))}
        </div>
      )}

      {phase === 'playing' && (
        <>
          <SynopsisSearch onGuess={handleGuess} disabled={false} />
          <div className="synopsis-game__actions">
            {canReveal && (
              <button className="synopsis-game__btn" onClick={handleReveal}>
                Reveal Hint
              </button>
            )}
            <button className="synopsis-game__btn" onClick={handleSkip}>
              Skip
            </button>
          </div>
        </>
      )}

      {(phase === 'correct' || phase === 'wrong') && (
        <div className="synopsis-game__actions">
          <button className="synopsis-game__btn synopsis-game__btn--primary" onClick={handleNext}>
            {round + 1 < synopses.length ? 'Next Synopsis' : 'See Results'}
          </button>
        </div>
      )}

      <div className="synopsis-game__score-bar">
        <span>Score: {score}/{maxScore}</span>
      </div>
    </div>
  );
}

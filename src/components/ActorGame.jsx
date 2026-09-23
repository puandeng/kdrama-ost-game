import { useState, useRef, useEffect, useMemo } from 'react';
import {
  ROLE_CONFIG, ROUNDS_PER_GAME, EPISODE_THRESHOLDS,
  getRandomActors, buildDramaIndex, searchAllDramas, getEpisode,
} from '../data/actors';
import './ActorGame.css';

function RoleBadge({ role }) {
  return (
    <span className={`role-badge role-badge--${role}`}>
      {ROLE_CONFIG[role].label}
    </span>
  );
}

function EpisodeBar({ score }) {
  const episode = getEpisode(score);

  return (
    <div className="episode-bar">
      <div className="episode-bar__header">
        <span className="episode-bar__label">
          {episode > 0 ? `Episode ${episode}/16` : 'Prologue'}
        </span>
        <span className="episode-bar__score">{score} pts</span>
      </div>
      <div className="episode-bar__segments">
        {EPISODE_THRESHOLDS.map((threshold, i) => {
          const reached = score >= threshold;
          const isCurrent = i + 1 === episode;
          return (
            <div
              key={i}
              className={`episode-bar__segment${reached ? ' episode-bar__segment--reached' : ''}${isCurrent ? ' episode-bar__segment--current' : ''}`}
              title={`Ep ${i + 1}: ${threshold} pts`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DramaGuessSearch({ onGuess, exclude }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const index = useMemo(() => buildDramaIndex(), []);

  useEffect(() => {
    if (query.length >= 1) {
      const matches = searchAllDramas(query, index).filter(d => !exclude.includes(d.title));
      setResults(matches);
      setOpen(matches.length > 0);
      setActiveIdx(-1);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query, index, exclude]);

  function handleSelect(drama) {
    onGuess(drama);
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
        placeholder="Name a K-drama they appeared in..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        autoComplete="off"
        spellCheck="false"
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

export default function ActorGame() {
  const [actors, setActors] = useState(() => getRandomActors(ROUNDS_PER_GAME));
  const [round, setRound] = useState(0);
  const [found, setFound] = useState({});
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('playing');
  const [feedback, setFeedback] = useState(null);
  const feedbackTimer = useRef(null);

  const actor = actors[round];
  const actorFound = found[actor?.id] || [];
  const allFound = actor && actorFound.length === actor.dramas.length;

  const excludeTitles = useMemo(
    () => [...actorFound.map(f => f.title), ...wrongGuesses],
    [actorFound, wrongGuesses]
  );

  function handleGuess(drama) {
    const match = actor.dramas.find(d => d.title === drama.title);
    clearTimeout(feedbackTimer.current);

    if (match) {
      const pts = ROLE_CONFIG[match.role].points;
      setFound(prev => ({
        ...prev,
        [actor.id]: [...(prev[actor.id] || []), {
          title: match.title, titleKo: match.titleKo, role: match.role, points: pts,
        }],
      }));
      setScore(s => s + pts);
      setFeedback({ type: 'correct', text: `+${pts} — ${ROLE_CONFIG[match.role].label} role` });
    } else {
      setWrongGuesses(prev => [...prev, drama.title]);
      setFeedback({ type: 'wrong', text: `${actor.name} wasn't in ${drama.title}!` });
    }

    feedbackTimer.current = setTimeout(() => setFeedback(null), 2000);
  }

  function handleNextActor() {
    setPhase('reveal');
    setFeedback(null);
  }

  function handleContinue() {
    setWrongGuesses([]);
    setFeedback(null);
    if (round + 1 >= actors.length) {
      setPhase('finished');
    } else {
      setRound(r => r + 1);
      setPhase('playing');
    }
  }

  function handlePlayAgain() {
    setActors(getRandomActors(ROUNDS_PER_GAME));
    setRound(0);
    setFound({});
    setWrongGuesses([]);
    setScore(0);
    setPhase('playing');
    setFeedback(null);
  }

  if (phase === 'finished') {
    const episode = getEpisode(score);
    return (
      <div className="actor-game">
        <div className="actor-game__final">
          <p className="actor-game__final-emoji">
            {episode >= 14 ? '🏆' : episode >= 10 ? '🌟' : episode >= 5 ? '👏' : '📺'}
          </p>
          <p className="actor-game__final-title">
            {episode >= 14 ? 'Drama Expert!' : episode >= 10 ? 'Impressive!' : episode >= 5 ? 'Not Bad!' : 'Keep Watching!'}
          </p>
          <p className="actor-game__final-score">
            Episode {episode}/16 — {score} points
          </p>
        </div>

        <EpisodeBar score={score} />

        <div className="actor-game__summary">
          {actors.map(a => {
            const aFound = found[a.id] || [];
            const foundTitles = aFound.map(f => f.title);
            const missed = a.dramas.filter(d => !foundTitles.includes(d.title));
            return (
              <div key={a.id} className="actor-game__summary-actor">
                <div className="actor-game__summary-header">
                  <span className="actor-game__summary-name">{a.name}</span>
                  <span className="actor-game__summary-ko">{a.nameKo}</span>
                </div>
                {aFound.map(f => (
                  <div key={f.title} className="actor-game__summary-row actor-game__summary-row--found">
                    <span className="actor-game__summary-icon">✓</span>
                    <span className="actor-game__summary-title">{f.title}</span>
                    <RoleBadge role={f.role} />
                    <span className="actor-game__summary-pts">+{f.points}</span>
                  </div>
                ))}
                {missed.map(d => (
                  <div key={d.title} className="actor-game__summary-row actor-game__summary-row--missed">
                    <span className="actor-game__summary-icon">✗</span>
                    <span className="actor-game__summary-title">{d.title}</span>
                    <RoleBadge role={d.role} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <button className="actor-game__btn" onClick={handlePlayAgain}>
          Play Again
        </button>
      </div>
    );
  }

  const missedDramas = phase === 'reveal'
    ? actor.dramas.filter(d => !actorFound.map(f => f.title).includes(d.title))
    : [];

  return (
    <div className="actor-game">
      <div className="actor-game__round">
        Round {round + 1}/{ROUNDS_PER_GAME}
      </div>

      <div className="actor-game__actor-card">
        <h2 className="actor-game__actor-name">{actor.name}</h2>
        <p className="actor-game__actor-ko">{actor.nameKo}</p>
        <img
          className="actor-game__actor-img"
          src={`/actors/${actor.id}.jpg`}
          alt={actor.name}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>

      <div className="actor-game__found-label">
        {actorFound.length}/{actor.dramas.length} dramas found
      </div>

      {feedback && (
        <div
          key={feedback.text}
          className={`actor-game__feedback actor-game__feedback--${feedback.type}`}
        >
          {feedback.text}
        </div>
      )}

      <div className="actor-game__drama-list">
        {actorFound.map(f => (
          <div key={f.title} className="actor-game__drama-row actor-game__drama-row--correct">
            <span className="actor-game__drama-title">{f.title}</span>
            <RoleBadge role={f.role} />
            <span className="actor-game__drama-pts">+{f.points}</span>
          </div>
        ))}
        {wrongGuesses.map(title => (
          <div key={title} className="actor-game__drama-row actor-game__drama-row--wrong">
            <span className="actor-game__drama-title">{title}</span>
            <span className="actor-game__drama-x">✗</span>
          </div>
        ))}
        {missedDramas.map(d => (
          <div key={d.title} className="actor-game__drama-row actor-game__drama-row--missed">
            <span className="actor-game__drama-title">{d.title}</span>
            <RoleBadge role={d.role} />
          </div>
        ))}
      </div>

      {phase === 'playing' && !allFound && (
        <DramaGuessSearch onGuess={handleGuess} exclude={excludeTitles} />
      )}

      {allFound && phase === 'playing' && (
        <div className="actor-game__perfect">All dramas found!</div>
      )}

      <div className="actor-game__actions">
        {phase === 'playing' && (
          <button className="actor-game__btn" onClick={handleNextActor}>
            {round + 1 < actors.length ? 'Next Actor/Actress' : 'Finish'}
          </button>
        )}
        {phase === 'reveal' && (
          <button className="actor-game__btn actor-game__btn--primary" onClick={handleContinue}>
            {round + 1 < actors.length ? 'Continue' : 'See Results'}
          </button>
        )}
      </div>

      <EpisodeBar score={score} />
    </div>
  );
}

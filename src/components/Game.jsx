import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  DRAMAS, DURATIONS, MAX_GUESSES,
  buildSearchIndex, searchDramas, getRandomPuzzle,
} from '../data/dramas';
import './Game.css';

function AudioBar({ duration, maxDuration, playing, onPlay, audioError }) {
  const pct = (duration / maxDuration) * 100;

  return (
    <div className="audio-bar">
      <button
        className={`audio-bar__play ${playing ? 'audio-bar__play--playing' : ''}`}
        onClick={onPlay}
        disabled={audioError}
        aria-label={playing ? 'Playing' : 'Play snippet'}
      >
        {playing ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="4" y="3" width="4" height="14" rx="1" />
            <rect x="12" y="3" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3l12 7-12 7V3z" />
          </svg>
        )}
      </button>

      <div className="audio-bar__track">
        <div className="audio-bar__fill" style={{ width: `${pct}%` }} />
        <div className="audio-bar__locked" style={{ left: `${pct}%`, width: `${100 - pct}%` }} />
      </div>

      <span className="audio-bar__time">
        {duration}s
        <span className="audio-bar__time-max"> / {maxDuration}s</span>
      </span>

      {audioError && (
        <span className="audio-bar__error">Audio not found</span>
      )}
    </div>
  );
}

function DramaSearch({ onGuess, disabled, exclude }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const index = useMemo(() => buildSearchIndex(), []);

  useEffect(() => {
    if (query.length >= 1) {
      const matches = searchDramas(query, index).filter(d => !exclude.includes(d.id));
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
        placeholder={disabled ? 'Round over' : 'Search for a K-drama...'}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        disabled={disabled}
        autoComplete="off"
        spellCheck="false"
      />
      {open && (
        <ul className="drama-search__results" ref={listRef}>
          {results.map((d, i) => (
            <li
              key={d.id}
              className={`drama-search__result ${i === activeIdx ? 'drama-search__result--active' : ''}`}
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

function GuessRow({ guess, index: rowIdx, current }) {
  if (!guess) {
    return (
      <div className={`guess-row ${current ? 'guess-row--current' : 'guess-row--empty'}`}>
        <span className="guess-row__num">{rowIdx + 1}</span>
        <span className="guess-row__label">
          {current ? '▶ Your turn' : ''}
        </span>
        <span className="guess-row__duration">{DURATIONS[rowIdx]}s</span>
      </div>
    );
  }

  return (
    <div className={`guess-row ${guess.correct ? 'guess-row--correct' : guess.skipped ? 'guess-row--skipped' : 'guess-row--wrong'}`}>
      <span className="guess-row__num">{rowIdx + 1}</span>
      <span className="guess-row__label">
        {guess.skipped ? 'Skipped' : guess.title}
      </span>
      <span className="guess-row__icon">
        {guess.correct ? '✓' : guess.skipped ? '—' : '✗'}
      </span>
    </div>
  );
}

export default function Game() {
  const [{ drama, index: puzzleIdx }, setPuzzleState] = useState(() => getRandomPuzzle(-1));
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const round = guesses.length;
  const currentDuration = round < MAX_GUESSES ? DURATIONS[round] : DURATIONS[MAX_GUESSES - 1];

  const excludeIds = useMemo(
    () => guesses.filter(g => !g.skipped).map(g => g.id),
    [guesses]
  );

  const dramaIdRef = useRef(null);

  function loadAudio() {
    if (dramaIdRef.current === drama.id) return;
    dramaIdRef.current = drama.id;

    clearTimeout(timerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(drama.audio);
    audio.preload = 'auto';
    audioRef.current = audio;
    setAudioError(false);
    setPlaying(false);
    audio.load();
  }

  loadAudio();

  function playSnippet() {
    const audio = audioRef.current;
    if (!audio) return;

    clearTimeout(timerRef.current);
    audio.pause();
    audio.currentTime = 0;

    const dur = gameOver ? 10 : currentDuration;
    audio.play().then(() => {
      setPlaying(true);
      timerRef.current = setTimeout(() => {
        audio.pause();
        setPlaying(false);
      }, dur * 1000);
    }).catch((err) => {
      console.error('Play failed:', err);
      setAudioError(true);
    });
  }

  function handleGuess(dramaResult) {
    if (gameOver) return;
    const correct = dramaResult.id === drama.id;
    const newGuesses = [...guesses, { id: dramaResult.id, title: dramaResult.title, correct, skipped: false }];
    setGuesses(newGuesses);

    if (correct) {
      setWon(true);
      setGameOver(true);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
    }
  }

  function handleSkip() {
    if (gameOver) return;
    const newGuesses = [...guesses, { id: null, title: null, correct: false, skipped: true }];
    setGuesses(newGuesses);

    if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
    }
  }

  function handleNewPuzzle() {
    clearTimeout(timerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    dramaIdRef.current = null;
    const next = getRandomPuzzle(puzzleIdx);
    setPuzzleState(next);
    setGuesses([]);
    setGameOver(false);
    setWon(false);
    setPlaying(false);
  }

  return (
    <div className="game">
      <AudioBar
        duration={currentDuration}
        maxDuration={10}
        playing={playing}
        onPlay={playSnippet}
        audioError={audioError}
      />

      {audioError && (
        <p className="game__audio-hint">
          Add <code>{drama.audio}</code> to the <code>public/</code> folder to hear this OST
        </p>
      )}

      <div className="game__guesses">
        {Array.from({ length: MAX_GUESSES }, (_, i) => (
          <GuessRow
            key={i}
            guess={guesses[i] || null}
            index={i}
            current={i === round && !gameOver}
          />
        ))}
      </div>

      {!gameOver && (
        <div className="game__controls">
          <DramaSearch onGuess={handleGuess} disabled={gameOver} exclude={excludeIds} />
          <button className="game__skip" onClick={handleSkip}>
            Skip (hear {DURATIONS[Math.min(round + 1, MAX_GUESSES - 1)]}s)
          </button>
        </div>
      )}

      {gameOver && (
        <div className={`game__result ${won ? 'game__result--win' : 'game__result--lose'}`}>
          <p className="game__result-emoji">{won ? '🎉' : '😢'}</p>
          <p className="game__result-title">{drama.title}</p>
          <p className="game__result-ost">
            "{drama.ost.title}" — {drama.ost.artist}
          </p>
          {won && (
            <p className="game__result-score">
              Guessed in {guesses.length} / {MAX_GUESSES}
              {guesses.length === 1 ? ' — Incredible!' : guesses.length <= 3 ? ' — Nice!' : ''}
            </p>
          )}
        </div>
      )}

      <button className="game__shuffle" onClick={handleNewPuzzle}>
        Shuffle Puzzle
      </button>
    </div>
  );
}

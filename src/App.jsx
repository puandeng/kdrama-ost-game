import { useState } from 'react';
import Game from './components/Game';
import ActorGame from './components/ActorGame';
import Background from './components/Background';
import './App.css';

const SUBTITLES = {
  ost: 'Guess the K-drama from its OST — you start with just 0.75 seconds!',
  actor: 'Name K-dramas an actor/actress appeared in — obscure roles score more!',
};

function App() {
  const [tab, setTab] = useState('ost');

  return (
    <div className="app">
      <Background />
      <header className="app__header">
        <h1 className="app__title">K-Drama Challenge</h1>
        <p className="app__subtitle">{SUBTITLES[tab]}</p>
        <nav className="app__tabs">
          <button
            className={`app__tab${tab === 'ost' ? ' app__tab--active' : ''}`}
            onClick={() => setTab('ost')}
          >
            OST Heardle
          </button>
          <button
            className={`app__tab${tab === 'actor' ? ' app__tab--active' : ''}`}
            onClick={() => setTab('actor')}
          >
            Actor/Actress Quiz
          </button>
        </nav>
      </header>
      <main className="app__main">
        {tab === 'ost' ? <Game /> : <ActorGame />}
      </main>
    </div>
  );
}

export default App;

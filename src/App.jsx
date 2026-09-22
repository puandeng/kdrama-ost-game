import Game from './components/Game';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">K-Drama OST Guesser</h1>
        <p className="app__subtitle">Guess the K-drama from its OST — you start with just 0.1 seconds!</p>
      </header>
      <main className="app__main">
        <Game />
      </main>
    </div>
  );
}

export default App;

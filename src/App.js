import React, { useState } from 'react';
import { GameProvider, useGame } from './GameContext';
import './App.css';

const Game = () => {
  const { gameState, joinGame, startRound, submitClue, evaluateClues, guessWord, sendMessage, resetGame } = useGame();
  const [clue, setClue] = useState('');
  const [guess, setGuess] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [joined, setJoined] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const handleJoin = () => {
    joinGame(playerName);
    setJoined(true);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      sendMessage(chatMessage);
      setChatMessage('');
    }
  };

  return (
    <div className="Game">
      {!joined ? (
        <div>
          <h1>Join Game</h1>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <div>
          <h1>Just One Multiplayer Game</h1>
          <h2>Players</h2>
          <ul>
            {gameState.players.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>
          <button onClick={startRound}>Start Round</button>
          <div>
            <h2>Submit a Clue</h2>
            <input
              type="text"
              value={clue}
              onChange={(e) => setClue(e.target.value)}
            />
            <button onClick={() => submitClue(clue)}>Submit Clue</button>
          </div>
          <div>
            <h2>Evaluate Clues</h2>
            <button onClick={evaluateClues}>Evaluate Clues</button>
            <ul>
              {gameState.uniqueClues.map((clue, index) => (
                <li key={index}>{clue}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Guess the Word</h2>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
            />
            <button onClick={() => guessWord(guess)}>Guess Word</button>
          </div>
          {gameState.gameOver && <h2>Game Over! Your score: {gameState.score}</h2>}
          <div>
            <h2>Chat</h2>
            <div className="chat-box">
              {gameState.messages.map((msg, index) => (
                <div key={index}>
                  <strong>{msg.player}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
          <button onClick={resetGame}>Reset Game</button>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <div className="App">
        <Game />
      </div>
    </GameProvider>
  );
}

export default App;

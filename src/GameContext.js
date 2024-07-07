import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const socket = io('http://localhost:5000');

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    wordLength: 0,
    uniqueClues: [],
    score: 0,
    gameOver: false,
    players: [],
    messages: [],
  });

  useEffect(() => {
    socket.on('newRound', (data) => {
      setGameState((prevState) => ({
        ...prevState,
        wordLength: data.wordLength,
        uniqueClues: [],
      }));
    });

    socket.on('cluesEvaluated', (uniqueClues) => {
      setGameState((prevState) => ({
        ...prevState,
        uniqueClues,
      }));
    });

    socket.on('correctGuess', (word) => {
      alert(`Correct! The word was: ${word}`);
    });

    socket.on('wrongGuess', (word) => {
      alert(`Wrong! The word was: ${word}`);
    });

    socket.on('gameOver', (score) => {
      setGameState((prevState) => ({
        ...prevState,
        gameOver: true,
        score,
      }));
    });

    socket.on('playerList', (players) => {
      setGameState((prevState) => ({
        ...prevState,
        players,
      }));
    });

    socket.on('receiveMessage', (message) => {
      setGameState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, message],
      }));
    });

    return () => {
      socket.off('newRound');
      socket.off('cluesEvaluated');
      socket.off('correctGuess');
      socket.off('wrongGuess');
      socket.off('gameOver');
      socket.off('playerList');
      socket.off('receiveMessage');
    };
  }, []);

  const joinGame = (playerName) => {
    socket.emit('joinGame', playerName);
  };

  const startRound = () => {
    socket.emit('startRound');
  };

  const submitClue = (clue) => {
    if (clue.trim()) {
      socket.emit('submitClue', clue);
    } else {
      alert('Clue cannot be empty');
    }
  };

  const evaluateClues = () => {
    socket.emit('evaluateClues');
  };

  const guessWord = (guess) => {
    if (guess.trim()) {
      socket.emit('guessWord', guess);
    } else {
      alert('Guess cannot be empty');
    }
  };

  const sendMessage = (message) => {
    socket.emit('sendMessage', message);
  };

  const resetGame = () => {
    setGameState({
      wordLength: 0,
      uniqueClues: [],
      score: 0,
      gameOver: false,
      players: [],
      messages: [],
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        joinGame,
        startRound,
        submitClue,
        evaluateClues,
        guessWord,
        sendMessage,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

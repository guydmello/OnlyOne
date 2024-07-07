const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Game = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all origins
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
}));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the Just One multiplayer game server!');
});

// Initialize the game
const game = new Game();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinGame', (playerName) => {
    game.addPlayer(socket.id, playerName);
    io.emit('playerList', game.players);
  });

  socket.on('startRound', () => {
    game.startRound();
    io.emit('newRound', {
      wordLength: game.words[game.currentWordIndex].length
    });
  });

  socket.on('submitClue', (clue) => {
    game.submitClue(socket.id, clue);
  });

  socket.on('evaluateClues', () => {
    const uniqueClues = game.evaluateClues();
    io.emit('cluesEvaluated', uniqueClues);
  });

  socket.on('guessWord', (guess) => {
    const correct = game.guessWord(guess);
    if (correct) {
      io.emit('correctGuess', game.words[game.currentWordIndex]);
    } else {
      io.emit('wrongGuess', game.words[game.currentWordIndex]);
    }
    game.nextRound();
    if (game.isGameOver()) {
      io.emit('gameOver', game.score);
    } else {
      io.emit('newRound', {
        wordLength: game.words[game.currentWordIndex].length
      });
    }
  });

  socket.on('sendMessage', (message) => {
    const player = game.players.find(player => player.id === socket.id);
    if (player) {
      io.emit('receiveMessage', { player: player.name, message });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    game.removePlayer(socket.id);
    io.emit('playerList', game.players);
    io.emit('receiveMessage', { player: 'System', message: `${player.name} has left the game.` });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

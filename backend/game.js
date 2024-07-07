class Game {
    constructor() {
      this.players = [];
      this.words = ["apple", "banana", "cherry", "date", "elderberry"];
      this.currentWordIndex = 0;
      this.currentClues = [];
      this.roundsPlayed = 0;
      this.maxRounds = 13;
      this.score = 0;
    }
  
    addPlayer(playerId, playerName) {
      this.players.push({ id: playerId, name: playerName, clue: '' });
    }
  
    removePlayer(playerId) {
      this.players = this.players.filter(player => player.id !== playerId);
    }
  
    startRound() {
      this.currentWordIndex = Math.floor(Math.random() * this.words.length);
      this.currentClues = [];
    }
  
    submitClue(playerId, clue) {
      const player = this.players.find(player => player.id === playerId);
      if (player) {
        player.clue = clue;
      }
    }
  
    evaluateClues() {
      const uniqueClues = [];
      const clueCounts = {};
  
      this.players.forEach(player => {
        const clue = player.clue.toLowerCase();
        clueCounts[clue] = (clueCounts[clue] || 0) + 1;
      });
  
      this.players.forEach(player => {
        const clue = player.clue.toLowerCase();
        if (clueCounts[clue] === 1) {
          uniqueClues.push(clue);
        }
      });
  
      return uniqueClues;
    }
  
    guessWord(guess) {
      const currentWord = this.words[this.currentWordIndex];
      if (guess.toLowerCase() === currentWord.toLowerCase()) {
        this.score += 1;
        return true;
      } else {
        return false;
      }
    }
  
    nextRound() {
      this.roundsPlayed += 1;
      if (this.roundsPlayed < this.maxRounds) {
        this.startRound();
      }
    }
  
    isGameOver() {
      return this.roundsPlayed >= this.maxRounds;
    }
  }
  
  module.exports = Game;
  
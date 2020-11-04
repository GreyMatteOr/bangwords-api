const Player = require('../Player/Player.js');

class Game {
  constructor(maxWrongAttempts = 6) {
    this.guessWord = '';
    this.maxWrongAttempts = maxWrongAttempts;
    this.generatorID = null;
    this.players = {};
    this.finished = 0;
    this.winners = [];
    this.count = 0;
  }

  addPlayer( id ) {
    this.players[id] = new Player(id, this.maxWrongAttempts);
  }

  getNextPlayer() {
    if (this.generatorID) {
      let playerIDs = Object.keys(this.players);
      let current = playerIDs.indexOf(this.generatorID);
      let indexOfNext = (current + 1) % playerIDs.length;
      this.setGenerator(playerIDs[indexOfNext])
      return playerIDs[indexOfNext];
    } else {
      this.setGenerator(Object.keys(this.players)[0])
      return Object.keys(this.players)[0];
    }
  }

  isOver() {
    return this.finished === Object.keys(this.players).length;
  }

  makeGuess( playerID, guess) {
    let player = this.players[playerID];
    let justWon = player.attempt(this.guessWord, guess);
    if (justWon) {
      player.addPoints(Math.max(30 - (this.winners.length * 10), 0));
      this.winners.push(playerID);
      this.finished++;
    } else if (player.getAttemptsLeft() <= 0) {
      this.finished++;
    }
  }

  removePlayer( id ) {
    delete this.players[id];
  }

  setGuessWord(word) {
    this.guessWord = word.toLowerCase();
  }

  setGenerator(id) {
    this.generatorID = id;
  }

  verifyGen( playerID ) {
    return this.generatorID === playerID;
  }

  reset() {
    this.count++;
    this.finished = 0;
    this.generatorID = this.getNextPlayer();
    this.winners = []
    this.guessWord = '';
    Object.values(this.players).forEach( player => player.reset())

  }
}

if (typeof module !== "undefined") {
  module.exports = Game;
};

const Player = require('../Player/Player.js');

class Game {
  constructor(maxWrongAttempts = 6) {
    this.wordToGuess = '';
    this.maxWrongAttempts = maxWrongAttempts;
    this.generatorID = null;
    this.players = {};
    this.finished = 0;
    this.winners = [];
    this.count = 0;
  }

  addPlayer( id ) {
    this.players[id] = new Player(id);
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

  removePlayer( id ) {
    delete this.players[id];
  }

  setGuessWord(word) {
    this.wordToGuess = word.toLowerCase();
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
    this.wordToGuess = '';
    Object.values(this.players).forEach( player => player.reset())

  }
}

if (typeof module !== "undefined") {
  module.exports = Game;
};

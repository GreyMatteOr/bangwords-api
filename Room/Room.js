const Game = require('../Game/Game.js');

class Room {
  constructor( id ) {
    this.id = id;
    this.players = {};
    this.game = new Game();
  }

  addPlayer( id, name ) {
    this.players[id] = {name, score: 0};
  }

  deletePlayer( id ) {
    if (this.game.verifyGen(id)) {
      this.game.setGenerator(null);
    }
    delete this.players[id];
  }

  validate ( id ) {
    return Object.keys(this.players).includes(id);
  }

  getStateData() {
    let game = this.game;
    return {
      attempts: game.attemptedGuesses,
      display: game.displayRevealed(),
      hasGenerator: game.generatorID !== null,
      isGameReady: this.isGameReady(),
      isOver: game.isOver(),
      isWon: game.checkGameWon(),
      playerNames: Object.values(this.players).map(player => player.name),
      remainingGuesses: game.getGuessesLeft()
    }
  }

  getPlayerCount() {
    return Object.keys(this.players).length;
  }

  isGameReady() {
    return this.getPlayerCount() >= 2 && !this.game.isOver() && this.game.wordToGuess !== '';
  }
}

if (typeof module !== "undefined") {
  module.exports = Room;
};

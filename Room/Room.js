const Game = require('../Game/Game.js');

class Room {
  constructor( id ) {
    this.id = id;
    this.players = {};
    game = new Game();
  }

  addPlayer( id, name ) {
    this.players[id] = {name, score: 0};
  }

  deletePlayer( id ) {
    delete this.players[id];
  }

  validate ( id ) {
    return Object.keys(this.players).includes(id);
  }

  getStateData() {
    let game = this.game;
    return {
      display: game.displayRevealed(),
      isOver: game.isOver(),
      isWon: game.checkGameWon(),
      remainingGuesses: game.getGuessesLeft(),
      attempts: game.attemptedGuesses,
      isGameReady: isGameReady(),
      hasGenerator: game.generatorID !== null
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
  module.exports = Game;
};

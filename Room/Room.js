const Game = require('../Game/Game.js');

class Room {
  constructor( id ) {
    this.id = id;
    this.playerNames = {};
    this.game = new Game();
  }

  addPlayer( id, name ) {
    this.playerNames[id] = name;
    this.game.addPlayer( id );
  }

  deletePlayer( id ) {
    if (this.game.verifyGen(id)) {
      this.game.setGenerator(null);
    }
    delete this.playerNames[id];
    this.game.deletePlayer(id)
  }

  getPlayerName( id ) {
    return this.playerNames[id].name;
  }

  validate ( id ) {
    return Object.keys(this.playerNames).includes(id);
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
      playerNames: Object.values(this.playerNames).map(player => player.name),
      remainingGuesses: game.getGuessesLeft()
    }
  }

  getPlayerCount() {
    return Object.keys(this.playerNames).length;
  }

  isGameReady() {
    return this.getPlayerCount() >= 2 && !this.game.isOver() && this.game.guessWord !== '';
  }
}

if (typeof module !== "undefined") {
  module.exports = Room;
};

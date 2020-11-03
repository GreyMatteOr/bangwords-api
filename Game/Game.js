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
      let playerNames = Object.keys(this.players);
      let current = playerIDs.indexOf(this.generatorID);
      let indexOfNext = (current + 1) % playerIDs.length;
      this.setGenerator(this.playerIDs[indexOfNext])
      return this.playerIDs[indexOfNext];
    } else {
      this.setGenerator(Object.keys(this.players)[0])
      return Object.keys(this.players)[0];
    }
  }

  removePlayer( id ) {
    delete this.players[id];
  }

  setWordToGuess(word) {
    this.wordToGuess = word.toLowerCase();
  }

  setGenerator(id) {
    this.generatorID = id;
  }

  isOver() {
    return this.finished === Object.keys(this.players).length;
  }

  verifyGen( player ) {
    return this.generatorID === player.id;
  }

  reset(id) {
    this.count++;
    this.finished = 0;
    this.generatorID = getNextPlayer();
    this.winners = []
    this.wordToGuess = '';
    this.players.forEach( player = player.reset())
  }
}

if (typeof module !== "undefined") {
  module.exports = Game;
};

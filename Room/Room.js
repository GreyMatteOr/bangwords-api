const Game = require('../Game/Game.js');

class Room {
  constructor( id ) {
    this.id = id;
    this.playerNames = {};
    this.game = new Game();
  }

  addPlayer( id, name ) {
    if (Object.values(this.playerNames).includes(name)) {
      let uniqifier = 1;
      while (Object.values(this.playerNames).includes(name + uniqifier)) {
        uniqifier++;
      }
      name += uniqifier;
    }
    this.playerNames[id] = name;
    this.game.addPlayer( id );
  }

  deletePlayer( id ) {
    delete this.playerNames[id];
    this.game.deletePlayer(id);
  }

  getPlayerName( id ) {
    return this.playerNames[id];
  }

  getGuessResponse( id ) {
    let player = this.game.getPlayer( id );
    let { guessWord } = this.game;
    return {
      attempts: player.attempts,
      attemptsLeft: player.getAttemptsLeft(),
      display: player.getRevealed(guessWord),
      isWon: player.checkGameWon(guessWord)
    }
  }

  getLoadData( id ) {
    let player = this.game.getPlayer( id );
    let { guessWord } = this.game;
    return {
      attempts: [],
      attemptsLeft: player.getAttemptsLeft(),
      display: player.getRevealed(guessWord),
      hasGenerator: this.game.generatorID !== null,
      isGameReady: this.isGameReady(),
      isOver: this.game.isOver(),
      isWon: false,
      playerNames: Object.values(this.playerNames),
      userName: this.getPlayerName(id),
      scores: this.getScores()
    }
  }

  getStateData( id ) {
    let player = this.game.getPlayer( id );
    let { guessWord } = this.game;
    return {
      attempts: player.attempts,
      attemptsLeft: player.getAttemptsLeft(),
      display: player.getRevealed(guessWord),
      hasGenerator: this.game.generatorID !== null,
      hasWord: this.game.guessWord !== '',
      isGameReady: this.isGameReady(),
      isOver: this.game.isOver(),
      isWon: player.checkGameWon(guessWord),
      playerNames: Object.values(this.playerNames),
      scores: this.getScores()
    }
  }

  getPlayerCount() {
    return Object.keys(this.playerNames).length;
  }

  getScores() {
    return Object.entries(this.playerNames).reduce((scores, [id, name]) => {
      scores[name] = this.game.getPlayerScore( id );
      return scores;
    }, {});
  }

  getWinners() {
    let output = this.game.winners.map((id, i) => {
      let name = this.getPlayerName( id ) || '[--redacted--]';
      return `${i + 1}.) ${name} +${ 30 - (i * 10) }`
    });
    output.push(this.game.guessWord)
    return output.length > 1 ? output : ['Wow, that was hard. No one won!', this.game.guessWord];
  }

  isGameReady() {
    return this.getPlayerCount() >= 2 && !this.game.isOver() && this.game.guessWord !== '';
  }
}

if (typeof module !== "undefined") {
  module.exports = Room;
};

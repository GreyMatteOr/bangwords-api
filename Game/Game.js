const symbols = '\ .,!?@#$%^&*()"\':;{}[]\\|<>/';

class Game {
  constructor(maxWrongAttempts = 6) {
    this.wordToGuess = '';
    this.maxWrongAttempts = maxWrongAttempts;
    this.attemptedGuesses = [];
    this.wrongGuesses = 0;
    this.correctGuesses = [];
    this.count = 0;
    this.generatorID = null;
  }

  setWordToGuess(word) {
    this.wordToGuess = word.toLowerCase();
  }

  setGenerator(id) {
    this.generatorID = id;
  }

  getGuessesLeft() {
    return this.maxWrongAttempts - this.wrongGuesses;
  }

  isOver() {
    return this.maxWrongAttempts === this.wrongGuesses || this.checkGameWon();
  }

  verifyGen(id) {
    return +this.generatorID === +id;
  }

  reset() {
    this.wordToGuess = '';
    this.generatorID = null;
    this.attemptedGuesses = [];
    this.wrongGuesses = 0;
    this.correctGuesses = [];
    this.count++;
  }

  reviewAttempt(guess) {
    guess = guess.toLowerCase();
    if (this.attemptedGuesses.includes(guess)) {
      return;
    }
    this.attemptedGuesses.push(guess);
    if (this.wordToGuess != guess && !this.wordToGuess.includes(guess)) {
      this.wrongGuesses += 1;
      return `'${guess}' was a bad guess.`
    } else {
      this.correctGuesses.push(guess);
      return this.checkGameWon();
    }
  }

  checkGameWon() {
    let theWordSplit = this.wordToGuess.split('');
    if (this.correctGuesses.slice(-1)[0] == this.wordToGuess) {
      return true;
    }
    let revealedAll = theWordSplit.every(letter => {
      return this.correctGuesses.includes(letter) || symbols.includes(letter);
    });
    if (revealedAll) {
      return true;
    }
    return false;
  }

  displayRevealed() {
    let theWordSplit = this.wordToGuess.split('');
    return theWordSplit.map(letter => {
      if (this.correctGuesses.includes(letter) ||
        symbols.includes(letter)) {
        return letter;
      }
      return '_';
    })
  }
}

if (typeof module !== "undefined") {
  module.exports = Game;
};

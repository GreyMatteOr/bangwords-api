const symbols = '\ .,!?@#$%^&*()"\':;{}[]\\|<>/';

class Player {
  constructor( id ) {
    this.attemptedGuesses = [];
    this.correctGuesses = [];
    this.id = id;
    this.score = 0;
    this.wrongAttempts = 0;
  }

  addScore( points ) {
    this.score += points;
  }

  checkGameWon(word) {
    if (this.correctGuesses.includes(this.wordToGuess)) {
      return true;
    }
    let chars = word.split('');
    let revealedAll = chars.every(letter => {
      return this.correctGuesses.includes(letter) || symbols.includes(letter);
    });
    if (revealedAll) {
      return true;
    }
    return false;
  }

  getRevealed(word, inPoints = false) {
    let chars = this.word.split('')
    .map(char => {
      if (this.correctGuesses.includes(letter) ||
        symbols.includes(letter)) {
        return letter;
      }
      return '_';
    });
    if (inPoints) {
      return chars.filter(char => char === '_').length;
    }
    return chars;
  }

  getGuessesLeft( base ) {
    return base - this.wrongAttempts;
  }

  reset() {
    this.attemptedGuesses = [];
    this.correctGuesses = [];
    this.wrongGuesses = 0;
  }

  reviewAttempt(word, guess) {
    guess = guess.toLowerCase();
    if (this.attemptedGuesses.includes(guess)) {
      return;
    }
    this.attemptedGuesses.push(guess);
    if (word != guess && !word.includes(guess)) {
      this.wrongGuesses += 1;
      return `'${guess}' was a bad guess.`
    } else {
      this.correctGuesses.push(guess);
      return this.checkGameWon(word);
    }
  }

}

if (typeof module !== "undefined") {
  module.exports = Player;
};

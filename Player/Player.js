const symbols = '\ .,!?@#$%^&*()"\':;{}[]\\|<>/';

class Player {
  constructor( id ) {
    this.attempts = [];
    this.correct = [];
    this.id = id;
    this.score = 0;
    this.wrongAttempts = 0;
  }

  addScore( points ) {
    this.score += points;
  }

  checkGameWon(word) {
    if (this.correct.includes(word)) {
      return true;
    }
    let chars = word.split('');
    let revealedAll = chars.every(letter => {
      return this.correct.includes(letter) || symbols.includes(letter);
    });
    if (revealedAll) {
      return true;
    }
    return false;
  }

  getAttemptsLeft( base ) {
    return base - this.wrongAttempts;
  }

  getRevealed(word, inPoints = false) {
    let chars = word.split('')
    .map(char => {
      if (this.correct.includes(char) ||
        symbols.includes(char)) {
        return char;
      }
      return '_';
    });
    if (inPoints) {
      return chars.filter(char => char === '_').length;
    }
    return chars;
  }

  reset() {
    this.attempts = [];
    this.correct = [];
    this.wrongAttempts = 0;
  }

  reviewAttempt(word, guess) {
    guess = guess.toLowerCase();
    if (this.attempts.includes(guess)) {
      return;
    }
    this.attempts.push(guess);
    if (word != guess && !word.includes(guess)) {
      this.wrongAttempts += 1;
      return `'${guess}' was a bad guess.`
    } else {
      this.correct.push(guess);
      return this.checkGameWon(word);
    }
  }

}

if (typeof module !== "undefined") {
  module.exports = Player;
};

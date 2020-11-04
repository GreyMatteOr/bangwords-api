const symbols = '\ .,!?@#$%^&*()"\':;{}[]\\|<>/';

class Player {
  constructor( id , maxWrongAttempts) {
    this.attempts = [];
    this.correct = [];
    this.id = id;
    this.maxWrongAttempts = maxWrongAttempts;
    this.score = 0;
    this.wrongAttempts = 0;
  }

  addPoints( points ) {
    this.score += points;
  }

  attempt(word, guess) {
    guess = guess.toLowerCase();
    if (this.attempts.includes(guess)) {
      return false;
    }
    this.attempts.push(guess);
    if (word != guess && !word.includes(guess)) {
      this.wrongAttempts += 1;
      return false;
    } else {
      this.correct.push(guess);
      return this.checkGameWon(word);
    }
  }

  checkGameWon(word) {
    if (this.correct.includes(word)) {
      this.scoreGame(word);
      return true;
    }

    let chars = word.split('');
    let revealedAll = chars.every(letter => {
      return this.correct.includes(letter) || symbols.includes(letter);
    });

    if (revealedAll) {
      this.scoreGame();
      return true;
    }
    return false;
  }

  getAttemptsLeft() {
    return this.maxWrongAttempts - this.wrongAttempts;
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

  scoreGame(word = '') {
    let basePoints = 10 * this.getAttemptsLeft();
    let bonusPoints = 5 * this.getRevealed(word, true);
    this.addPoints( basePoints + bonusPoints );
  }
}

if (typeof module !== "undefined") {
  module.exports = Player;
};

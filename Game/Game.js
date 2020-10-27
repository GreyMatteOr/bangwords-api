class Game {
    constructor(wordToGuess, maxWrongAttempts = 6) {
        // this.alive = true;
        this.player1;
        this.player2;
        this.wordToGuess = wordToGuess.toLowerCase();
        this.maxWrongAttempts = maxWrongAttempts;
        this.attemptedGuesses = []; // All of these will be displayed as guesses
        this.wrongGuesses = 0;
        this.correctGuesses = []; // These will be displayed as correct guesses only
    }

    reviewAttempt(guess) {
        guess = guess.toLowerCase();
        if (this.attemptedGuesses.includes(guess)) {
          return;
        }
        this.attemptedGuesses.push(guess);
        if (this.wordToGuess != guess && !this.wordToGuess.includes(guess)) {
            return this.wrongAttempt(guess);
        } else {
            this.correctGuesses.push(guess);
            return this.correctAttempt();
        }
    }

    wrongAttempt(guess) {
        this.wrongGuesses += 1;
        if (this.wrongGuesses >= this.maxWrongAttempts) {
            return 'The man is dead';
        }
        return `'${guess}' was a bad guess.`
    }

    correctAttempt() {
        let theWordSplit = this.wordToGuess.split('');
        if (this.correctGuesses.slice(-1)[0] == this.wordToGuess) {
            return this.winGame();
        }
        if (theWordSplit.every(letter => this.correctGuesses.includes(letter))) {
            return this.winGame();
        }
    }

    winGame() {
        return 'The man is alive';
    }

    displayRevealed() {
      let theWordSplit = this.wordToGuess.split('');
      return theWordSplit.map(letter => {
        if(this.correctGuesses.includes(letter) ||
         '\ .,!?@#$%^&*()"\':;{}[]\\|<>/'.includes(letter)) {
          return letter;
        }
        return '_';
      })
    }
}

if (typeof module !== "undefined") {
    module.exports = Game;
};

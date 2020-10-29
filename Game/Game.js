const symbols = '\ .,!?@#$%^&*()"\':;{}[]\\|<>/';

class Game {
    constructor(maxWrongAttempts = 6) {
        this.wordToGuess = '';
        this.generatorID = null;
        this.maxWrongAttempts = maxWrongAttempts;
        this.attemptedGuesses = []; // All of these will be displayed as guesses
        this.count = 0;
        this.wrongGuesses = 0;
        this.correctGuesses = []; // These will be displayed as correct guesses only
    }

    setWordToGuess(word) {
      return this.wordToGuess = word.toLowerCase();
    }

    setGenerator(id) {
      return this.generatorID = id;
    }

    getGuessesLeft() {
      return this.maxWrongAttempts - this.wrongGuesses;
    }

    isOver() {
      return this.maxWrongAttempts === this.wrongGuesses;
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
            return this.wrongAttempt(guess);
        } else {
            this.correctGuesses.push(guess);
            return this.correctAttempt();
        }
    }

    wrongAttempt(guess) {
        this.wrongGuesses += 1;
        if (this.isOver()) {
            this.reset();
            return 'The man is dead';
        }
        return `'${guess}' was a bad guess.`
    }

    correctAttempt() {
        let theWordSplit = this.wordToGuess.split('');
        if (this.correctGuesses.slice(-1)[0] == this.wordToGuess) {
            return this.winGame();
        }
        let revealedAll = theWordSplit.every(letter => {
            return this.correctGuesses.includes(letter) || symbols.includes(letter);
        });
        if (revealedAll) {
            return this.winGame();
        }
    }

    winGame() {
        this.reset();
        return 'The man is alive';
    }

    displayRevealed() {
        let theWordSplit = this.wordToGuess.split('');
          return theWordSplit.map(letter => {
            if(this.correctGuesses.includes(letter) ||
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

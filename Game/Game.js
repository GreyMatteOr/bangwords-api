const symbols = '\ .,!?@#$%^&*()"\':;{}[]\\|<>/';

class Game {
    constructor(maxWrongAttempts = 6) {
        this.wordToGuess = '';
        this.generatorID = null;
        this.maxWrongAttempts = maxWrongAttempts;
        this.attemptedGuesses = []; // All of these will be displayed as guesses
        this.wrongGuesses = 0;
        this.correctGuesses = []; // These will be displayed as correct guesses only
    }

    setWordToGuess(word) {
      this.wordToGuess = word.toLowerCase();
    }

    setGenerator(id) {
      this.generatorID = id;
    }

    verifyGen(id) {
      return this.generatorID === id;
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
        let revealedAll = theWordSplit.every(letter => {
            return this.correctGuesses.includes(letter) || symbols.includes(letter);
        });
        if (revealedAll) {
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

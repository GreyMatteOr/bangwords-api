class Game {
    constructor(wordToGuess, maxWrongAttempts) {
        // this.alive = true;
        this.player1;
        this.player2;
        this.wordToGuess = wordToGuess;
        this.maxWrongAttempts = maxWrongAttempts;
        this.attemptedGuesses = []; // All of these will be displayed as guesses
        this.wrongGuesses = 0;
        this.correctGuesses = []; // These will be displayed as correct guesses only
    }
    reviewAttempt(guess) {
        this.attemptedGuesses.push(guess);
        if (this.wordToGuess != guess && !this.wordToGuess.includes(guess)) {
            this.wrongGuesses += 1;
            this.wrongAttempt();
        } else {
            this.correctGuesses.push(guess);
            this.correctAttempt();
        }
    }
    wrongAttempt() {
        if (this.wrongGuesses >= this.maxWrongAttempts) {
            alert('The man is dead');
            location.reload();
        }
    }
    correctAttempt() {
        let theWordSplit = this.wordToGuess.split('');
        if (this.correctGuesses.slice(-1)[0] == this.wordToGuess) {
            winGame();
        }
        if (this.correctGuesses.includes(theWordSplit)) {
            winGame();
        }
    }
    winGame() {
        alert('The man has survived');
        location.reload();
    }
}

if (typeof module !== "undefined") {
    module.exports = Game;
};
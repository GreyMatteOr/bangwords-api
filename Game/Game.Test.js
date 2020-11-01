const chai = require("chai");
const expect = chai.expect;

let Game = require("./Game");

describe('Game', () => {
  let a;
  beforeEach(() => {
    a = new Game(3);
    a.setWordToGuess('game')
  })

  describe('Basic Functionality', () => {

    it('1. should be a function', function() {
      expect(Game).to.be.a('function');
    });

    it('2. should be an instance of Game', function() {
      expect(a).to.be.an.instanceof(Game);
    });
  })

  describe('Properties', () => {
    it("3. should have a word to guess", () => {
      expect(a.wordToGuess).to.equal('game');
    })

    it("4. should have a `maxWrongAttempts` property", () => {
      expect(a.maxWrongAttempts).to.equal(3);
    })

    it("5. attemptedGuesses should start as an empty array", () => {
      expect(a.attemptedGuesses).to.deep.equal([]);
    })

    it("6. wrongGuesses should start at 0", () => {
      expect(a.wrongGuesses).to.equal(0);
    })

    it("7. correctGuesses should start as an empty array", () => {
      expect(a.correctGuesses).to.deep.equal([]);
    })
  })

  describe('Methods', () => {

    describe('reviewAttempt() method (this.wrongGuesses)', () => {
      it("8a. a wrong guess should increase `this.wrongGuesses`", () => {

        a.reviewAttempt('C');
        a.reviewAttempt('d');

        expect(a.wrongGuesses).to.equal(2);
      })

      it("8b. a guess that has already occured should not affect `this.wrongGuesses`", () => {

        a.reviewAttempt('g');
        a.reviewAttempt('G');

        expect(a.wrongGuesses).to.equal(0);

        a.reviewAttempt('c');
        a.reviewAttempt('C');

        expect(a.wrongGuesses).to.equal(1);
      });

      it("8c. when enough wrong guesses happen, game should end in a Loss", () => {

        expect(a.reviewAttempt('z')).to.equal('\'z\' was a bad guess.');
        expect(a.reviewAttempt('y')).to.equal('\'y\' was a bad guess.');
        expect(a.reviewAttempt('x')).to.equal('\'x\' was a bad guess.');

        expect(a.isOver()).to.equal(true);
        expect(a.checkGameWon()).to.equal(false);
      })


      it("9a. a correct guess should not increase `this.wrongGuesses`", () => {

        a.reviewAttempt('g');

        expect(a.wrongGuesses).to.equal(0);
      })

    })

    describe('reviewAttempt() method (this.correctGuesses)', () => {
      it("10. a bad guess should not increase the length of `this.correctGuesses`", () => {

        a.reviewAttempt('c');

        expect(a.correctGuesses.length).to.equal(0);
      })

      it("11. a correct guess should increase the length of `this.correctGuesses`", () => {

        a.reviewAttempt('g');

        expect(a.correctGuesses).to.deep.equal(['g']);
      })

      it("12. a correct guess should be the last index of `this.correctGuesses`", () => {

        a.reviewAttempt('e');
        a.reviewAttempt('g');

        expect(a.correctGuesses).to.deep.equal(['e', 'g']);
      })

      it("13. when all letters have been guessed, it should end in a win", () => {

        a.reviewAttempt('a');
        a.reviewAttempt('e');
        a.reviewAttempt('g');

        expect(a.reviewAttempt('m')).to.equal(true);
      })
    })

    describe('displayRevealed() method (this.correctGuesses)', () => {

      it('14. to start, it should return one `_` per letter', () => {

        expect(a.displayRevealed()).to.deep.equal(['_', '_', '_', '_']);
      })

      it('14. for each correct guess, it include those letters', () => {

        a.setWordToGuess('game guru')

        expect(a.displayRevealed()).to.deep.equal(
          ['_', '_', '_', '_', ' ', '_', '_', '_', '_']
        );

        a.reviewAttempt('a');
        expect(a.displayRevealed()).to.deep.equal(
          ['_', 'a', '_', '_', ' ', '_', '_', '_', '_']
        );

        a.reviewAttempt('g');
        expect(a.displayRevealed()).to.deep.equal(
          ['g', 'a', '_', '_', ' ', 'g', '_', '_', '_']
        );

        a.reviewAttempt('u');
        expect(a.displayRevealed()).to.deep.equal(
          ['g', 'a', '_', '_', ' ', 'g', 'u', '_', 'u']
        );

        a.reviewAttempt('e');
        expect(a.displayRevealed()).to.deep.equal(
          ['g', 'a', '_', 'e', ' ', 'g', 'u', '_', 'u']
        );

        a.reviewAttempt('m');
        expect(a.reviewAttempt('r')).to.equal(true);

      })
    })

    describe('setWordToGuess', () => {

      it('should set the word to guess', () => {
        expect(a.wordToGuess).to.equal('game')
      });

      it('should convert the word toLowerCase', () => {

        a.setWordToGuess('GaME!')

        expect(a.wordToGuess).to.equal('game!')
      })
    });

    describe('setGenerator', () => {

      it('should set the id of who is the current generator', () => {

        a.setGenerator(123);

        expect(a.generatorID).to.equal(123);
      });
    });

    describe('verifyGen', () => {

      it('should return `true` if id matches. Else, `false`', () => {

        a.setGenerator(123);

        expect(a.verifyGen(123)).to.equal(true);
        expect(a.verifyGen(12)).to.equal(false);
      });
    });

    describe('getGuessesLeft', () => {

      it('should give back the correct wrong guesses a player can make', () => {

        expect(a.getGuessesLeft()).to.equal(3);

        a.reviewAttempt('a');

        expect(a.getGuessesLeft()).to.equal(3);

        a.reviewAttempt('b');

        expect(a.getGuessesLeft()).to.equal(2);
      });
    });

    describe('isOver', () => {

      it('should return `true` if someone lost', () => {

        a.reviewAttempt('b');
        a.reviewAttempt('c');
        a.reviewAttempt('d');

        expect(a.isOver()).to.equal(true);
      });

      it('should return `true` if someone won', () => {

        a.reviewAttempt('a');
        a.reviewAttempt('e');
        a.reviewAttempt('g');
        a.reviewAttempt('m');

        expect(a.isOver()).to.equal(true);
      });

      it('should return `false` otherwise', () => {

        expect(a.isOver()).to.equal(false);
      });
    });
  });
});

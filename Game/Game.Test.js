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

    describe('reset', () => {

      it('should reset the game', () => {

        a.reset();

        expect(a.wordToGuess).to.equal('');
        expect(a.generatorID).to.equal(null);
        expect(a.attemptedGuesses).to.deep.equal([]);
        expect(a.wrongGuesses).to.equal(0);
        expect(a.correctGuesses).to.deep.equal([]);
        expect(a.count).to.equal(1);
      });
    });
  });
});

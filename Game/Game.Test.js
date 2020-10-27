const chai = require("chai");
const expect = chai.expect;

let Game = require("./Game");

describe('Game', () => {

    describe('Basic Functionality', () => {

        it('1. should be a function', function() {
            expect(Game).to.be.a('function');
        });

        it('2. should be an instance of Game', function() {
            const a = new Game('game', 3);
            expect(a).to.be.an.instanceof(Game);
        });
    })

    describe('Properties', () => {
        it("3. should have a word to guess", () => {

            const a = new Game('game', 3);

            expect(a.wordToGuess).to.equal('game');
        })

        it("3a. should always store the word in lower-case", () => {

            const a = new Game('GaMe', 3);

            expect(a.wordToGuess).to.equal('game');
        })

        it("4. should have a `maxWrongAttempts` property", () => {

            const a = new Game('game', 3);

            expect(a.maxWrongAttempts).to.equal(3);
        })

        it("5. attemptedGuesses should start as an empty array", () => {

            const a = new Game('game', 3);

            expect(a.attemptedGuesses).to.deep.equal([]);
        })

        it("6. wrongGuesses should start at 0", () => {

            const a = new Game('game', 3);

            expect(a.wrongGuesses).to.equal(0);
        })

        it("7. correctGuesses should start as an empty array", () => {

            const a = new Game('game', 3);

            expect(a.correctGuesses).to.deep.equal([]);
        })
    })

    describe('Methods', () => {

        describe('reviewAttempt() method (this.wrongGuesses)', () => {
            it("8a. a wrong guess should increase `this.wrongGuesses`", () => {

                const a = new Game('game', 3);

                a.reviewAttempt('C');
                a.reviewAttempt('d');

                expect(a.wrongGuesses).to.equal(2);
            })

            it("8b. a guess that has already occured should not affect `this.wrongGuesses`", () => {
              const a = new Game('game', 3);
                a.reviewAttempt('g');
                a.reviewAttempt('G');

                expect(a.wrongGuesses).to.equal(0);

                a.reviewAttempt('c');
                a.reviewAttempt('C');

                expect(a.wrongGuesses).to.equal(1);
            });

            it("8c. when enough wrong guesses happen, game should end in a Loss", () => {

                const a = new Game('game', 3);

                expect(a.reviewAttempt('z')).to.equal('\'z\' was a bad guess.');
                expect(a.reviewAttempt('y')).to.equal('\'y\' was a bad guess.');
                expect(a.reviewAttempt('x')).to.equal('The man is dead');
                expect(a.wrongGuesses).to.equal(a.maxWrongAttempts);

                a.reviewAttempt('c');

            })


            it("9a. a correct guess should not increase `this.wrongGuesses`", () => {

                const a = new Game('game', 3);

                a.reviewAttempt('g');

                expect(a.wrongGuesses).to.equal(0);
            })

        })

        describe('reviewAttempt() method (this.correctGuesses)', () => {
            it("10. a bad guess should not increase the length of `this.correctGuesses`", () => {

                const a = new Game('game', 3);

                a.reviewAttempt('c');

                expect(a.correctGuesses.length).to.equal(0);
            })

            it("11. a correct guess should increase the length of `this.correctGuesses`", () => {

                const a = new Game('game', 3);

                a.reviewAttempt('g');

                expect(a.correctGuesses).to.deep.equal(['g']);
            })

            it("12. a correct guess should be the last index of `this.correctGuesses`", () => {

                const a = new Game('game', 3);

                a.reviewAttempt('e');
                a.reviewAttempt('g');

                expect(a.correctGuesses).to.deep.equal(['e','g']);
            })

            it("13. when all letters have been guessed, it should end in a win", () => {

              const a = new Game('game', 3);

              a.reviewAttempt('a');
              a.reviewAttempt('e');
              a.reviewAttempt('g');

              expect(a.reviewAttempt('m')).to.equal('The man is alive');
              expect(a.correctGuesses).to.deep.equal(['a','e','g','m']);
            })
        })

        describe('displayRevealed() method (this.correctGuesses)', () => {

          it('14. to start, it should return one `_` per letter', () => {
            const a = new Game('game', 3);

            expect(a.displayRevealed()).to.deep.equal(['_','_','_','_']);
          })

          it('14. for each correct guess, it include those letters', () => {
            const a = new Game('game guru', 3);

            expect(a.displayRevealed()).to.deep.equal(
              ['_','_','_','_',' ','_','_','_','_']
            );

            a.reviewAttempt('a');
            expect(a.displayRevealed()).to.deep.equal(
              ['_','a','_','_',' ','_','_','_','_']
            );

            a.reviewAttempt('g');
            expect(a.displayRevealed()).to.deep.equal(
              ['g','a','_','_',' ','g','_','_','_']
            );

            a.reviewAttempt('u');
            expect(a.displayRevealed()).to.deep.equal(
              ['g','a','_','_',' ','g','u','_','u']
            );

            a.reviewAttempt('e');
            expect(a.displayRevealed()).to.deep.equal(
              ['g','a','_','e',' ','g','u','_','u']
            );

            a.reviewAttempt('m');
            a.reviewAttempt('r');
            expect(a.displayRevealed()).to.deep.equal(
              ['g','a','m','e',' ','g','u','r','u']
            );

          })
        })
    })
})

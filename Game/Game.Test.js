// To test this run --> ./node_modules/.bin/mocha --require babel-register ./Game/Game.Test.js
// https://www.pluralsight.com/guides/unit-test-react-component-mocha

const chai = require("chai");
const expect = chai.expect;

let Game = require("./Game");

describe('Game', () => {

    describe('Basic Functionality', () => {
        it('1. should be a function', function() {
            // const a = new Game('game', 3);
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
            it("8. a wrong guess should increase `this.wrongGuesses`", () => {

                const a = new Game('game', 3);
    
                a.reviewAttempt('c');
                a.reviewAttempt('c');
    
                expect(a.wrongGuesses).to.equal(2);
            })
    
            it("9. a correct guess should not increase `this.wrongGuesses`", () => {
    
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
    
                expect(a.correctGuesses.length).to.equal(1);
            })

            it("12. a correct guess should be the last index of `this.correctGuesses`", () => {
    
                const a = new Game('game', 3);
    
                a.reviewAttempt('e');
                a.reviewAttempt('g');
    
                expect(a.correctGuesses.slice(-1)[0]).to.equal('g');
            })
        })
        
    })
})
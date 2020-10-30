const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Game = require('./Game/Game.js');
const cors = require('cors');
let game = new Game(), players = [], generator;

app.use(express.json());
app.use(cors());
app.set('port', process.env.PORT || 3001);

io.on( "connect", ( socket ) => {

  socket.on( 'joinGame', ( isGenerator ) => {
    if (isGenerator) {
      game.setGenerator(socket.id);
    }
    players.push(socket.id);
    io.emit('gameJoined', getStateData())
  })

  socket.on( 'setWord', ( word ) => {
    game.reset();
    game.setWordToGuess(word);
    io.emit('newWordToGuess', getStateData())
  })

  socket.on( 'makeGuess', ( guess ) => {
    game.reviewAttempt(guess);
    io.emit('result', getStateData())
  })
});

io.on( "disconnect", ( socket ) => {
  players = players.filter( player = player !== socket.id );
});

function isGameReady() {
  return players.length >= 2 && !game.isOver() && game.wordToGuess !== '';
}

function getStateData() {
  return {
    display: game.displayRevealed(),
    guesses: game.attemptedGuesses,
    isOver: game.isOver(),
    remainingGuesses: game.getGuessesLeft(),
    isOver: game.isOver(),
    attempts: game.attemptedGuesses,
    isGameReady: isGameReady()
  }
}

app.post('/', ({ body }, resp) => {
  if (body.act === 'join') {
    joinGame(body.isGenerator, resp);
  }
  if (body.act === 'word') {
    setWord(body, resp)
  }
  if (body.act === 'guess') {
    makeGuess(body, resp)
  }
  if (body.act === 'clear') {
    clearGame(resp)
  }
  resp.status(400).json(`Incorrect 'act' verb, Received: ${body.act}`);
})

app.get('/', (body, resp) => {
  resp.status(200).json({
    numPlayers: players.length,
    attempts: game.attemptedGuesses,
    remainingGuesses: game.getGuessesLeft(),
    isOver: game.isOver(),
    display: game.displayRevealed(),
    ready: players.length >= 2 && game.generatorID !== null && game.wordToGuess !== ''
  });
})

function joinGame(isGenerator, resp) {
  if (isGenerator === 'true') {
    isGenerator = true;
  } else if (isGenerator === 'false') {
    isGenerator = false;
  } else {
    return resp.status(400).json(`Role needs to be \`true\` or \`false\`. Is: ${resp.isGenerator}.`);
  }
  let id = Date.now();
  while (players.includes(id)) {
    id -= 1;
  }
  if (isGenerator) {
    game.setGenerator(id);
  }
  players.push(id);
  resp.status(200).json({
    id,
    ready: players.length >= 2 && game.generatorID !== null && game.wordToGuess !== '',
    isGenerator: isGenerator,
    numPlayers: players.length
  });
}

function setWord({ word, id }, resp) {
  if (!word) {
    return resp.status(400).json(`Word is missing. Word: ${word}.`);
  }
  if (!game.verifyGen(id)) {
    return resp.status(401).json(`Not the generator. ID provided: ${id}.`);
  }
  game.setWordToGuess(word);
  if (players.length < 2) {
    return resp.status(200).json(`Received. Waiting on others to join...`);
  }
  resp.status(200).json(
    {
      display: game.displayRevealed(),
      remainingGuesses: game.getGuessesLeft(),
      isOver: game.isOver(),
      attempts: game.attemptedGuesses
    }
  );
}

function makeGuess({ guess, id }, resp) {
  if (guess.length <= 0) {
    return resp.status(400).json(`Guess is missing. Guess: ${guess}.`);
  }
  if (game.verifyGen(id)) {
    return resp.status(401).json(`Generator is not allowed to guess. ID provided: ${id}.`);
  }
  if (!players.includes(+id)) {
    return resp.status(401).json(`Only current players may guess. ID provided: ${id}.`);
  }
  game.reviewAttempt(guess);
  resp.status(200).json({
    display: game.displayRevealed(),
    remainingGuesses: game.getGuessesLeft(),
    isOver: game.isOver(),
    attempts: game.attemptedGuesses
  })
}

function clearGame(resp) {
  game.reset();
  players = [];
  resp.status(200).json({
    numPlayers: players.length,
    isGenerator: null,
    attempts: [],
    isOver: false,
    display: []
  });
}

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});

module.exports = { server, game };

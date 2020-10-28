const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Game = require('./Game/Game.js');
let game = new Game, players = [], generator;

app.use(express.json());
app.set('port', process.env.PORT || 3000);

app.post('/', ({ body }, resp) => {
  console.log(body)
  if (body.act === 'join') {
    joinGame(body.isGenerator, resp);
  }
  if (body.act === 'word') {
    startGame(body, resp)
  }
  if (body.act === 'guess') {
    makeGuess(body, resp)
  }
  resp.status(400).json(`Incorrect 'act' verb, Received: ${body.act}`);
})

app.get('/', (body, resp) => {
  resp.send('<h3>Connected</h3>');
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
    ready: players.length >= 2,
    isGen: isGenerator}
  );
}

function startGame({ word, id }, resp) {
  if (!word) {
    return resp.status(400).json(`Word is missing. Word: ${word}.`);
  }
  if (game.verifyGen(id)) {
    return resp.status(401).json(`Not the generator. ID provided: ${id}.`);
  }
  game.setWordToGuess(word);
  if (players.length < 2) {
    return resp.status(200).json(`Received. Waiting on others to join...`);
  }
  resp.status(200).json({
    display: game.displayRevealed(),
    guesses: game.getGuessesLeft(),
    isOver: game.isOver()
  });
}

function makeGuess({ guess, id }, resp) {
  if (!guess) {
    return resp.status(400).json(`Guess is missing. Guess: ${guess}.`);
  }
  if (!game.verifyGen(id)) {
    return resp.status(401).json(`Generator is not allowed to guess. ID provided: ${id}.`);
  }
  if (!players.includes(id)) {
    return resp.status(401).json(`Only current players may guess. ID provided: ${id}.`);
  }
  game.reviewAttempt(guess);
  resp.status(200).json({
    display: game.displayRevealed(),
    guesses: game.getGuessesLeft(),
    isOver: game.isOver()
  })
}

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});


io.on('connection', (socket) => {
  console.log('A user has connected.', io.engine.clientsCount)
  io.sockets.emit(`User${io.engine.clientsCount} has connected`);
  socket.on('disconnect', () => {
    console.log('A user has disconnected.', io.engine.clientsCount)
    io.sockets.emit(`User${io.engine.clientsCount} has disconnected`);
  })
})

module.exports = server;

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Game = require('./Game/Game.js');
let game = new Game, players = [], generator;

app.set('port', process.env.PORT || 3000);

app.post('/', (req, resp) => {
  if (req.act === 'join') {
    joinGame(req.isGenerator, resp);
  }
  if (req.act === 'word' && req.word &&) {
    startGame(req, resp)
  }
  if (req.act === 'guess') {
    makeGuess(req, resp)
  }
  resp.status(400).json("Incorrect 'act' verb");
})

app.get('/', (req, resp) => {
  resp.send('<h3>Connected</h3>');
})

joinGame(isGenerator, resp) {
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
  resp.status(200).json(id);
}

startGame({ word, id }, resp) {
  if (!word || !id) {
    return resp.status(400).json(`Word or id are missing. Word: ${word}. Id: ${id}`);
  }
  game.setWordToGuess(word);
  if (players.length < 2) {
    return resp.status(200).json(`Received. Waiting on others to join...`);
  }
  resp.status(200).json('Received. Game starting.')
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

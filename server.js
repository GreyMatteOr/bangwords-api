const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Game = require('./Game/Game.js');
let game;

app.set('port', process.env.PORT || 3000);

io.on('connection', (socket) => {
  console.log('A user has connected.', io.engine.clientsCount)
  io.sockets.emit(`User${io.engine.clientsCount} has connected`);
  socket.on('disconnect', () => {
    console.log('A user has disconnected.', io.engine.clientsCount)
    io.sockets.emit(`User${io.engine.clientsCount} has disconnected`);
  })
})

app.post('/', (req, resp) => {
  if (req.act === 'join') {
    joinGame(resp);
  }
  if (req.act === 'word') {
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

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});

module.exports = server;

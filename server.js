const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Game = require('./Game/Game.js');
const Room = require('./Room/Room.js');
const cors = require('cors');
let rooms = {}, players = {}, generator;

app.use(express.json());
app.use(cors());
app.set('port', process.env.PORT || 3001);

io.on( "connect", ( socket ) => {
  console.log(`${socket.id.slice(0, -8)} connected.`)

  socket.on( 'createRoom', ( id ) => {
    if (!room[id]) {
      room[id] = new Room(id);
      io.to(socket.id).emit( 'joinRoom', id )
    } else {
      io.to(socket.id).emit('result', {errorMSG: `A room with the name '${id}' already exists! Choose again`});
    }
  })

  socket.on( 'joinRoom', ( id ) => {
    if (room[id]) {
      room[id].addPlayer(socket.id);
      players[socket.id].roomID = id;
      io.to(socket.id).emit('result', room.getStateData())
    } else {
      io.to(socket.id).emit('result', {errorMSG: 'Room does not exist.'});
    }
  });

  socket.on( 'joinGame', ( isGenerator ) => {
    if (isGenerator) {
      game.setGenerator(socket.id);
    }
    players.push(socket.id);
    io.emit('result', getStateData())
  })

  socket.on( 'setWord', ( word ) => {
    game.reset();
    game.setWordToGuess(word);
    io.emit('result', getStateData())
  })

  socket.on( 'makeGuess', ( guess ) => {
    game.reviewAttempt(guess);
    io.emit('result', getStateData())
  })

  socket.on( 'forfeit', () => {
    game.reset();
    io.emit('result', getStateData());
  })

  socket.on( "disconnect", () => {
    delete players[socket.id];
  });
});

function isGameReady() {
  return players.length >= 2 && !game.isOver() && game.wordToGuess !== '';
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

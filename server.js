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
    if (!rooms[id]) {
      rooms[id] = new Room(id);
      io.to(socket.id).emit( 'joinRoom', id )
    } else {
      io.to(socket.id).emit('result', {errorMSG: `A room with the name '${id}' already exists! Choose again`});
    }
  })

  socket.on( 'joinRoom', ( id ) => {
    if (rooms[id]) {
      socket.join(id);
      players[socket.id] = id;
      io.to(id).emit('result', rooms[id].getStateData())
    } else {
      io.to(socket.id).emit('result', {errorMSG: 'Room does not exist.'});
    }
  });

  socket.on( 'setRole', ( isGenerator ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    if (isGenerator) {
      room.game.setGenerator(socket.id);
    }
    room.addPlayer(socket.id);
    io.to(roomID).emit('result', room.getStateData())
  })

  socket.on( 'setWord', ( word ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    room.game.reset();
    room.game.setWordToGuess(word);
    io.to(roomID).emit('result', getStateData())
  })

  socket.on( 'makeGuess', ( guess ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    room.game.reviewAttempt(guess);
    io.to(roomID).emit('result', getStateData())
  })

  socket.on( 'forfeit', () => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    room.game.reset();
    io.to(roomID).emit('result', getStateData());
  })

  socket.on( "disconnect", () => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    room.deletePlayer(socket.id);
    delete players[socket.id];
    if (room.players.getPlayerCount() <= 0) {
      delete rooms[roomID];
    }
  });
});

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

module.exports = { server, rooms };

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
  players[socket.id] = null;

  socket.on( 'createRoom', ( id ) => {
    if (!rooms[id]) {
      rooms[id] = new Room(id);
      io.to(socket.id).emit('result', joinRoom(socket, rooms[id]));
      io.emit('result', {rooms: Object.keys(rooms)});
    } else {
      io.to(socket.id).emit('result', {errorMSG: `A room with the name '${id}' already exists! Choose again`});
    }
  })

  socket.on( 'joinRoom', ( id ) => {
    if (rooms[id]) {
      io.in(id).emit('result', joinRoom(socket, id));
    } else {
      io.to(socket.id).emit('result', {errorMSG: `Room with name ${id} does not exist.`});
    }
  });

  socket.on( 'leaveRoom', () => {
    leaveRoom(socket);
    io.to(socket.id).emit('result', {inGame: false, isGenerator: null});
  })

  socket.on( 'sendMessage', ( message ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    let name = room.getPlayerName( socket.id );
    message = `${name}: ${message}`;
    io.in(roomID).emit('chatMessage', message)
  })

  socket.on( 'setRole', ( isGenerator, userName ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    if (isGenerator) {
      room.game.setGenerator(socket.id);
    }
    room.addPlayer(socket.id, userName);
    io.in(roomID).emit('result', room.getStateData())
  })

  socket.on( 'setWord', ( word ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    room.game.reset(socket.id);
    room.game.setGuessWord(word);
    io.in(roomID).emit('result', room.getStateData())
  })

  socket.on( 'makeGuess', ( guess ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    room.game.reviewAttempt(guess);
    io.in(roomID).emit('result', room.getStateData())
  })

  socket.on( 'forfeit', () => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    room.game.reset();
    io.in(roomID).emit('result', room.getStateData());
  })

  socket.on( "disconnect", () => {
    console.log(`${socket.id.slice(0, -8)} disconnected.`)
    leaveRoom(socket);
  });

  io.emit('result', { numOnline: Object.keys(players).length })
  io.to(socket.id).emit('result', {
    rooms: Object.keys(rooms),
    isLoading: false
  })
});

function joinRoom(socket, room) {
  socket.join(room.id);
  players[socket.id] = room.id;
  let info = {
    inRoom: true,
    hasGenerator: room.game.generatorID !== null
  }
  return info;
}

function leaveRoom( socket ) {
  let roomID = players[socket.id];
  players[socket.id] = null;
  socket.leave(roomID);
  let room = rooms[roomID];
  let changedState = {}
  if (room) {
    room.deletePlayer(socket.id);
    if (room.getPlayerCount() <= 0) {
      delete rooms[room.id];
    } else {
      io.in(room.id).emit('result', {playerNames: Object.values(room.playerNames)})
    }
  }
  return {rooms: Object.keys(rooms)};
}

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});

module.exports = { server, rooms, players, joinRoom, leaveRoom };

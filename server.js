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
      io.emit('result', {rooms: Object.keys(rooms)});
      io.in(id).emit('result', joinRoom(socket, id));
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
    room.game.setWordToGuess(word);
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

function leaveRoom( socket ) {
  let roomID = players[socket.id];
  delete players[socket.id];
  socket.leave(roomID);
  let room = rooms[roomID];
  if (room) {
    removePlayerData(room, roomID, socket)
  }
  io.emit('result', {
    rooms: Object.keys(rooms),
    numOnline: Object.keys(players).length
  });
}

function removePlayerData(room, roomID, socket) {
  room.deletePlayer(socket.id);
  if (room.getPlayerCount() <= 0) {
    delete rooms[roomID];
  }
  io.in(roomID).emit('result', room.getStateData());
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

function joinRoom(socket, roomID) {
  socket.join(roomID);
  players[socket.id] = roomID;
  let state = rooms[roomID].getStateData();
  state["inGame"] = true;
  return state;
}

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});

module.exports = { server, rooms };

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

  socket.on( 'setRole', ( isGenerator ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    if (isGenerator) {
      room.game.setGenerator(socket.id);
    }
    room.addPlayer(socket.id);
    io.in(roomID).emit('result', room.getStateData())
  })

  socket.on( 'setWord', ( word ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    room.game.reset();
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
    let roomID = players[socket.id];
    delete players[socket.id];
    if (roomID) {
      cleanData(roomID, socket)
    }
    io.emit('result', {
      rooms: Object.keys(rooms),
      numOnline: Object.keys(players).length
    });
  });

  io.emit('result', { numOnline: Object.keys(players).length })
  io.to(socket.id).emit('result', {
    rooms: Object.keys(rooms),
    isLoading: false
  })
});

function cleanData(roomID, socket) {
  socket.leave(roomID);
  let room = rooms[roomID];
  room.deletePlayer(socket.id);
  if (room.getPlayerCount() <= 0) {
    delete rooms[roomID];
  }
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

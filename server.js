const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Game = require('./Game/Game.js');
const Room = require('./Room/Room.js');
const cors = require('cors');
let rooms = {}, players = {};

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
      io.to(socket.id).emit('result', joinRoom(socket, rooms[id]));
    } else {
      io.to(socket.id).emit('result', {errorMSG: `Room with name '${id}' does not exist.`});
    }
  });

  socket.on( 'leaveRoom', () => {
    leaveRoom(socket);
    io.to(socket.id).emit('result', {inRoom: false, isGenerator: null});
  })

  socket.on( 'makeGuess', ( guess ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    room.game.makeGuess(socket.id, guess);
    io.to(socket.id).emit('result', room.getGuessResponse(socket.id))
    io.emit('result', {scores: room.getScores()})
    if(room.game.isOver()){
      console.log('game OVER')
      io.in(roomID).emit('result', {isOver: true, winners: room.getWinners()});
      setTimeout(() => {
        let nextGenID = room.game.reset();
        Object.keys(room.playerNames).forEach( id => io.to(id).emit('result', {isGenerator: id === nextGenID, isGameReady: false}))
      }, 5000)
    }
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
    io.to(socket.id).emit('result', room.getLoadData( socket.id ))
    socket.to(roomID).emit('result', {
      hasGenerator: room.game.generatorID !== null,
      isGameReady: room.isGameReady(),
      playerNames: Object.values(room.playerNames),
      scores: room.getScores()
    })
  })

  socket.on( 'setWord', ( word ) => {
    let roomID = players[socket.id];
    let room = rooms[roomID];
    room.game.setGuessWord(word);
    Object.keys(room.playerNames).forEach( socketID => {
      io.to(socketID).emit('result', room.getStateData( socketID ));
    });
  })

  socket.on( "disconnect", () => {
    leaveRoom(socket);
    delete players[socket.id];
    io.emit('result', {numOnline: Object.keys(players).length})
    console.log(`${socket.id.slice(0, -8)} disconnected.`)
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
      io.emit('result', {rooms: Object.keys(rooms)})
    } else {
      io.in(room.id).emit('result', {playerNames: Object.values(room.playerNames)})
    }
  }
}

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});

module.exports = { server, rooms, players, joinRoom, leaveRoom };

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('port', process.env.PORT || 3000);

io.on('connection', (socket) => {
  console.log('A user has connected.', io.engine.clientsCount)
  io.sockets.emit(`User${io.engine.clientsCount} has connected`);
  socket.on('disconnect', () => {
    console.log('A user has disconnected.', io.engine.clientsCount)
    io.sockets.emit(`User${io.engine.clientsCount} has disconnected`);
  })
})

app.get('/', (req, resp) => {
  resp.send('<h3>Connected</h3>');
})

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});

module.exports = server;

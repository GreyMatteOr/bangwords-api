let io = require('socket.io-client');
let { server, game } = require('./server.js');
let request = require('supertest');
let Game = require('./Game/Game.js');

describe('Suite of unit tests', function() {

  // let socket, app;
  // beforeEach(function(done) {
  //   socket = io.connect('http://localhost:3000', {
  //     'reconnection delay' : 0
  //     , 'reopen delay' : 0
  //     , 'force new connection' : true
  //   });
  //   socket.on('connect', function() {
  //     console.log('worked...');
  //     done();
  //   });
  //   socket.on('disconnect', function() {
  //     console.log('disconnected...');
  //   })
  // });
  //
  // afterEach(function(done) {
  //       // Cleanup
  //   if(socket.connected) {
  //     console.log('disconnecting...');
  //     socket.disconnect();
  //   } else {
  //   // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
  //     console.log('no connection to break...');
  //   }
  //   done();
  // });

  describe('server', function() {

    it('should return a connected message by default', async function(done) {
      const res = await request(server)
                        .get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('<h3>Connected</h3>');

      done();
    });

    it('should be able to host a new game', async function(done) {
      const res = await request(server)
                        .post('/')
                        .send({
                          "act": "join",
                          "isGenerator": "false"
                        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.ready).toEqual(false);
      expect(res.body.isGen).toEqual(false);
      expect(res.body.numPlayers).toEqual(1);
      expect(game.generatorID).toBeNull();
      done();
    });

    it('when the second player joins, the game should be ready', async function(done) {
      const res = await request(server)
                        .post('/')
                        .send({
                          "act": "join",
                          "isGenerator": "true"
                        });
      expect(res.body.ready).toEqual(true);
      expect(res.body.isGen).toEqual(true);
      expect(res.body.numPlayers).toEqual(2);
      expect(game.generatorID).toBeTruthy();
      done();
    });

  });
});

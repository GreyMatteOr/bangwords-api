let io = require('socket.io-client');
let { server, game } = require('./server.js');
let request = require('supertest');
let Game = require('./Game/Game.js');

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

let guesserID, genID;

describe('server', function() {

  it('should return a connected message by default', async function(done) {
    const res = await request(server)
                      .get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('<h3>Connected</h3>');

    done();
  });

  describe('joinGame', function() {

    it('should be able to host a new game', async function(done) {
      const res = await request(server)
                        .post('/')
                        .send({
                          "act": "join",
                          "isGenerator": "false"
                        });

      guesserID = res.body.id;
      expect(res.statusCode).toEqual(200);
      expect(res.body.ready).toEqual(false);
      expect(res.body.isGenerator).toEqual(false);
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
      genID = res.body.id;
      expect(res.body.ready).toEqual(true);
      expect(res.body.isGenerator).toEqual(true);
      expect(res.body.numPlayers).toEqual(2);
      expect(game.generatorID).toBeTruthy();
      done();
    });

    it('should return bad response when malformed requests are given', async function(done) {
      const badGen = await request(server)
                        .post('/')
                        .send({
                          "act": "join",
                          "isGenerator": ""
                        });
      expect(badGen.statusCode).toEqual(400);
      done();
    });
  });

  describe('setWordToGuess', function() {

    it('should be able to set new word', async function(done) {
      const res = await request(server)
                        .post('/')
                        .send({
                          "act": "word",
                          "word": "debug",
                          "id": JSON.stringify(genID)
                        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.display).toEqual(['_','_','_','_','_']);
      expect(res.body.guesses).toEqual(6);
      expect(res.body.isOver).toEqual(false);
      expect(game.wordToGuess).toEqual('debug');
      done();
    });

    it('should return an error for malformed bodies', async function(done) {
      const badWord = await request(server)
                        .post('/')
                        .send({
                          "act": "word",
                          "word": "",
                          "id": JSON.stringify(guesserID)
                        });
      expect(badWord.statusCode).toEqual(400);

      const badid = await request(server)
                        .post('/')
                        .send({
                          "act": "word",
                          "word": "asd",
                          "id": JSON.stringify(guesserID)
                        });
      expect(badid.statusCode).toEqual(401);
      expect(game.wordToGuess).toEqual('debug');
      done();
    });
  });

  describe('makeGuess', function() {

    it('should be able to guess letters', async function(done) {
      const res = await request(server)
                        .post('/')
                        .send({
                          "act": "guess",
                          "guess": "d",
                          "id": JSON.stringify(guesserID)
                        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.display).toEqual(['d','_','_','_','_']);
      expect(res.body.guesses).toEqual(6);
      expect(res.body.isOver).toEqual(false);
      expect(game.wordToGuess).toEqual('debug');
      done();
    });

    it('should return an error for malformed bodies', async function(done) {
      const badWord = await request(server)
                        .post('/')
                        .send({
                          "act": "guess",
                          "guess": "",
                          "id": JSON.stringify(guesserID)
                        });
      expect(badWord.statusCode).toEqual(400);

      const badid = await request(server)
                        .post('/')
                        .send({
                          "act": "guess",
                          "guess": "a",
                          "id": JSON.stringify(genID)
                        });
      expect(badid.statusCode).toEqual(401);
      expect(game.wordToGuess).toEqual('debug');
      done();
    });
  });

  describe('clear', function() {

    it('should be able to reset the game', async function(done) {
      const res = await request(server)
                        .post('/')
                        .send({
                          "act": "clear"
                        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        numPlayers: 0,
        isGenerator: null,
        guesses: [],
        isOver: false,
        display: []
      });
      done();
    });
  });

  afterAll(function(done) {
    server.close(done)
  });
});

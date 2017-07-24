var util = require("util");
var express = require('express');
var app = express();
var server = require('http').createServer(app)
//var morgan = require('morgan');
var port = 8005;

var ServerManager = require('./ServerManager.js');
var Player = require('./Player.js');

var serverManager = new ServerManager();
/*serverManager.createServer('TestServer', 4, 'kekplayertest', [{ name: 'kekplayertest' }]);
serverManager.createServer('TestServer22', 4, 'kekplayertest22', [{ name: 'kekplayertest22' }]);*/
//console.log(serverManager.retrieveServers());

var playersOnline = new Array();

//app.use(morgan('dev'));
db = require('mongojs')('localhost/killfriends', ['users', 'rooms']),
app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(server);

// Listen for connections from all ips on port 8005. process.env.port is used on Heroku
server.listen((process.env.PORT || 8005), "0.0.0.0");

console.log('listening to port ' + (process.env.PORT || 8005));

// Init function to start the game
function init() {
  setEventHandlers();
}

/** Game event handlers **/
function setEventHandlers() {
  io.sockets.on('connection', onSocketConnection);
}

function onSocketConnection(client) {
  // Search the database for the credentials and login.
  client.on('disconnect', playerDisconnected);
  client.on('register', registerNewPlayer);
  client.on('retrieve-servers', sendServers);
  client.on('create-server', createServer);
  client.on('join-server', joinServer);
  client.on('leave-server', leaveServer);
  client.on('ready', setReadyState);
  client.on('start-game', checkStartGameStatus);
  client.on('generated-map', sendGeneratedMapToPlayers)

  // Message for debugging purposes.
  console.log('Player connected: ' + client.id);
}

function sendGeneratedMapToPlayers(data) {
  console.log('Receiving generated map from server: ' + data.serverName);
  io.to(data.serverName).emit('init-game', {
    map: data.map,
  });
}

function setReadyState(data) {
  console.log('Ready State: ' + data.readyState);
  console.log('Server Name: ' + data.serverName);
  var id = this.id;
  console.log(serverManager.getServer(data.serverName).getPlayer(id));
  // Get the readystate sent by the client and set to it's corresponding player.
  if (data.readyState)
    serverManager.getServer(data.serverName).getPlayer(id).getReady();
  else
    serverManager.getServer(data.serverName).getPlayer(id).notReady();

  // And resend lobby info back to players.
  io.to(data.serverName).emit('lobby-info', {
    owner: serverManager.getServer(data.serverName).getOwner(),
    players: serverManager.getServer(data.serverName).retrievePlayersWithoutId(),
    slots: serverManager.getServer(data.serverName).slots,
  })
}

function checkStartGameStatus(data) {
  console.log('A new game is trying to start on server: ' + data.serverName);
  console.log('Checking if all players are ready.');
  
  /*if (!serverManager.getServer(data.serverName).canStartGame()) {
    io.to(data.serverName).emit('start-fail', { message: 'All players must be ready for the game to start!' })
    return;
  }*/

  io.to(data.serverName).emit('game-loading');
}

function registerNewPlayer(data) {
  var id = this.id;
  playersOnline[id] = { name: data.name };
}

function leaveServer(data) {
  if (serverManager.getServer(data.serverName).getOwner() == data.playerName) {
    serverManager.destroyServer(data.serverName);

    io.to(data.serverName).emit('leave-info', { admin: 1 });
    io.emit('server-list', { servers: serverManager.retrieveServers() } );
    this.leave(data.serverName);

    /*io.sockets.forEach(function(socket) {
      socket.leave(data.serverName);
    });
    io.sockets.clients(data.serverName).forEach(function(s){
      s.leave(data.serverName);
    });*/
  }
  else {
    this.leave(data.serverName)
    serverManager.getServer(data.serverName).removePlayer(this.id);
    this.emit('leave-info', { admin: 0 });
    io.emit('server-list', { servers: serverManager.retrieveServers() } );
    io.to(data.serverName).emit('lobby-info', {
      owner: serverManager.getServer(data.serverName).getOwner(),
      players: serverManager.getServer(data.serverName).retrievePlayersWithoutId(),
      slots: serverManager.getServer(data.serverName).slots,
    });
  }
  //console.log(serverManager.retrieveServers());
}

function joinServer(data) {
  var owner = this;
  // The player clicked to join the room.
  // If there are no free slots, send a message informing the user what happened.
  if (serverManager.getServer(data.name).freeSlots() == 0) {
    owner.emit('join-fail', { message: 'The server is full.' } );
    return;
  }
  //console.log('Joining server: ' + data.name + ' Player id: ' + owner.id);
  // Increments the occupiedSlots in the server and join the channel.
  serverManager.getServer(data.name).addPlayer(owner.id, playersOnline[owner.id].name, owner);
  console.log('Player ' + playersOnline[owner.id].name + ' joining server ' + data.name);
  owner.join(data.name);
  // Now populate the server with the new player
  // Now we send the info to all clients inside the lobby.
  io.to(data.name).emit('lobby-info', {
    owner: serverManager.getServer(data.name).getOwner(),
    players: serverManager.getServer(data.name).retrievePlayersWithoutId(),
    slots: serverManager.getServer(data.name).slots,
  });
  io.emit('server-list', { servers: serverManager.retrieveServers() } );
}

function createServer(data) {
  var owner = this;
  var id = owner.id;
  // The owner automatically joins this room.
  // To save processing the room is set as the server name.
  console.log('Player ' + playersOnline[id].name + ' joining server ' + data.name);
  owner.join(data.name);

  // Creates the server through the ServerManager.
  var playersArray = new Array();
  playersArray[id] = new Player(id, playersOnline[id].name, owner);
  serverManager.createServer(data.name, data.slots, playersOnline[id].name, playersArray);

  // Send it to the client.
  // Info about the retrievePlayersWithoutId inside the class.
  io.to(data.name).emit('lobby-info', {
    owner: playersOnline[id].name,
    players: serverManager.getServer(data.name).retrievePlayersWithoutId(),
    slots: serverManager.getServer(data.name).slots,
  });
  io.emit('server-list', { servers: serverManager.retrieveServers() } );
}

function playerDisconnected() {

}

function sendServers(client) {
  var clientSocket = this;
  // I thought about integrate the server creation with mongo but it makes no sense as it would be more performance expensive than just storing the servers in an array.
  // So instead of checking a database, we just send the array we used to create the server.
  clientSocket.emit('server-list', { servers: serverManager.retrieveServers() });
}

init();

var util = require("util");
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var morgan = require('morgan');
var port = 8005;
var playersOnline = new Array();
var serverList = new Array();
var currentServerId = 0;
// Sample server structure
// Keep in mind that the communication to players in this server will be made by rooms created with the server id, which is unique.
serverList[0] = {
  serverId: 0,
  name: 'TestServer 1',
  occupiedSlots: 1,
  slots: 4
};
serverList[1] = {
  serverId: 0,
  name: 'TestServer 2',
  occupiedSlots: 1,
  slots: 4
};
serverList[2] = {
  serverId: 0,
  name: 'TestServer 3',
  occupiedSlots: 1,
  slots: 4
};
currentServerId = 3;

app.use(morgan('dev'));
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
  client.on('retrieve-servers', sendServers);
  client.on('create-server', createServer);
  client.on('join-server', joinServer);

  // Message for debugging purposes.
  console.log('Player connected: ' + client.id);
}

function joinServer(data) {

}

function createServer(data) {
  var owner = this;
  // The owner automatically joins this room.
  // To save processing the room is set as the server id.
  this.join(currentServerId);
  // serverID: an incremental id generated by the server.
  // name: the name of the server defined by the client.
  // occupiedSlots: to avoid making calculations on the server when informing the number of people in the server we use this integer instead of comparing the playersOnline length with the slots.
  // slots: the maximum amount of people that can join the room.
  // playersOnline: the list of people in the room. the objects stored in this array can be used to emit events.
  serverList[currentServerId] = {
    serverId: currentServerId,
    name: data.name,
    occupiedSlots: 1,
    slots: data.slots,
    playersOnline: [owner],
  };
  // After adding the server to the list, increment the id for the next server.
  currentServerId++;
  // Send it to the client.
  io.emit('server-list', { servers: serverList });
}

function playerDisconnected() {

}

function sendServers(client) {
  var clientSocket = this;
  console.log(serverList);
  // I thought about integrate the server creation with mongo but it makes no sense as it would be more performance expensive than just storing the servers in an array.
  // So instead of checking a database, we just send the array we used to create the server.
  clientSocket.emit('server-list', { servers: serverList });
  /*db.rooms.find({}, function(err, found) {
    if (err || !found) {
      clientSocket.emit('server-list', { servers: new Array() });
    }
    else {
      var serverList = new Array();
      found.forEach(function(value) {
        serverList.push({ name: value.name, freeslots: 4, slots: 4 });
      });

      console.log(serverList);
      clientSocket.emit('server-list', { servers: serverList });
    }
  });*/
}

init();
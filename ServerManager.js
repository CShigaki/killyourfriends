var Server = require('./Server.js');
var currentServerId = 0;

function ServerManager () {
  console.log('Server Manager Instantiated.');
};

ServerManager.prototype.serverList = new Array();

ServerManager.prototype.destroyServer = function (serverName) {
  // Create a new array to substitute the old one.
  var serverListArrayNew = new Array();
  var destroyedId  = this.serverList[serverName].id;
  // Cycle through all servers.
  for (var server in this.serverList) {
    // Check if the index name is equal than the parameter server name.
    if (server != serverName) {
      // If it is, we add it to the new array.
      serverListArrayNew[server] = this.serverList[server];
      // If the id is > than the id to be removed.
      if (serverListArrayNew[server].id > destroyedId) {
        // Decrease the id.
        serverListArrayNew[server].id--;
      }
    }
  }
  // And finally set the server list as the new array of servers.
  this.serverList = serverListArrayNew;
};

// Get specific server.
ServerManager.prototype.getServer = function (name) {
  return this.serverList[name];
};

// Creates a new Server.
ServerManager.prototype.createServer = function (name, slots, ownerName, playersOnline) {
  this.serverList[name] = new Server(currentServerId, name, slots, ownerName, playersOnline);
  currentServerId++;
};

ServerManager.prototype.retrieveServers = function () {
  // If we try to send keyed arrays, the socket.io fails to send it.
  var serversArray = new Array();
  var playersArray = new Array();
  for (var name in this.serverList) {
    // Remove the keys from the servers array.
    serversArray[this.serverList[name].id] = Object.assign(new Server(), this.serverList[name]);

    // And also remove them from the players array.
    for (var players in this.serverList[name].playersOnline) {
      playersArray.push(this.serverList[name].playersOnline[players].name)
    }

    serversArray[this.serverList[name].id].playersOnline = playersArray;
    playersArray = new Array();
  }

  serversArray = serversArray.filter(function (n) { return n != undefined });
  // Return everything without the keys.
  return serversArray;
};

module.exports = ServerManager;

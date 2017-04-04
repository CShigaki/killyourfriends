// server-list: get a list of servers from the server.
socket.on('server-list', updateServers);
// lobby-info: get a list of the players and ready state from the server.
socket.on('lobby-info', displayLobby);
// join-fail: if the user couldn't join the server for some reason (currently only server is full).
socket.on('join-fail', displayJoinError)
// leave-info: server sends a confirmation message when an user leaves a room. 
socket.on('leave-info', leaveRoom);

function displayJoinError() {
  alert('This server is full!');
}

function leaveRoom(data) {
  $waitingLobbyForm.hide();
  $backToMenuButton.hide();
  $mainMenuContainer.show();
  if (data.admin == 0)
    alert('You left the room.');
  else
    alert('The room owner left the room. Returning to main menu.');
}

function displayLobby(data) {
  // Hides unecessary elements.
  $backToMenuButton.hide();
  $serverSelectionForm.hide();
  $serverCreationForm.hide();
  $waitingLobbyForm.show();
  $playerListing.empty();
  $('.owner-name').text(data.owner);
  // Change the number of people shown in the slots.
  $('.lobby-slots').text('(' + data.players.length + '/' + data.slots +')');
  data.players.forEach(function(player) {
    // Creates the listing of the players in the room. 
    if (player.readyState)
      $playerListing.append('<tr><td>' + player.name + '</td><td class="player-ready">Ready!</td></tr>');
    else
      $playerListing.append('<tr><td>' + player.name + '</td><td class="player-not-ready">Ready!</td></tr>');
  });
}

function updateServers(data) {
  $('.server-list').empty();
  data.servers.forEach(function(server) {
    // Retrieve the list of server from the servers and show it to the users.
    $('.server-list').append('<tr data-value="' + server.name + '"><td>' + server.name + '</td><td class="server-slots">' + server.playersOnline.length + '/' + server.slots + '</td></tr>')
  });
  console.log(currentServer);
}

// This will make a check to see if there already is a handler added to the element passed as a parameter.
function hasClickHandler(element) {
  if ($._data(element[0], "events") != undefined)
    return true;
}

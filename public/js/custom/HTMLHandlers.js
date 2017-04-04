function setupHTMLHandlers() {
  // Pass all the jquery objects to the variables.
  $registerNameButton = $('.register-name');
  $createServerButton = $('.create-server-menu');
  $browseServersButton = $('.browse-server-menu');
  $backToMenuButton = $('.back-to-menu');
  $leaveRoomButton = $('.leave-room');
  $joinGameButton = $('.join-server');
  $createGameButton = $('.create-server');
  $readyButton = $('.get-ready');
  $startGameButton = $('.start-game');

  $playerNameField = $('.player-name');
  $serverNameField = $('.server-name');
  $playerListing = $('.player-listing');

  $mainMenuContainer = $('#main-menu');
  $nameSelectionForm = $('.name-selection');
  $serverSelectionForm = $('.server-selection');
  $serverCreationForm = $('.server-creation');
  $serverCreationFormElement = $('.server-form');
  $waitingLobbyForm = $('.waiting-lobby');

  // Button for choosing a name.
  $registerNameButton.click(function() {
    if ($playerNameField.val() == '') {
      alert('You need to choose a name!');
      return;
    }
    socket.emit('register', { name: $playerNameField.val() });
    playerName = $playerNameField.val();
    $nameSelectionForm.hide();
    $mainMenuContainer.show();
    //THREEx.FullScreen.request();
    //initMenuScene();
    //animate();
  });

  // Button for joining a server.
  if (!hasClickHandler($joinGameButton)) {
    $joinGameButton.click(function() {
      if ($('.selected-server').length != 0) {
        $serverSelectionForm.hide();
        currentServer = $('.selected-server').data('value');
        socket.emit('join-server', { name: $('.selected-server').data('value'), });
      }
      else {
        alert('You must select a server!');
      }
    });
  }

  // Button for creating a server.
  if (!hasClickHandler($createGameButton)) {
    $createGameButton.click(function() {
      socket.emit('create-server', {
        name: $serverNameField.val(),
        slots: $('.players-slots').val()
      });
      currentServer = $serverNameField.val();
      $serverCreationFormElement.get(0).reset();
      $serverCreationForm.hide();
      $waitingLobbyForm.show();
    });
  }

  // Button for leaving a room.
  if (!hasClickHandler($(".leave-room"))) {
    $leaveRoomButton.click(function() {
      socket.emit('leave-server', {
        serverName: currentServer,
        playerName: playerName,
      });
      $waitingLobbyForm.hide();
      $mainMenuContainer.show();
    });
  }

  // Main menu button for creating server.
  $createServerButton.click(function() {
    displayServerCreation();
  });

  // Main menu button for browsing servers.
  $browseServersButton.click(function() {
    requestServers();
  });

  // Room button for starting game.
  $startGameButton.click(function() {

  });

  // Room button for getting ready.
  $readyButton.click(function() {
    // If the player is already ready, set it to false, otherwise, true.
    if (!$readyButton.data('ready'))
      $readyButton.data('ready', true);
    else
      $readyButton.data('ready', false);

    // Send the ready message to the server.
    socket.emit('ready', {
      serverName: currentServer,
      playerName: playerName,
      readyState: $readyButton.data('ready'),
    });
  });

  // Handler for choosing a server (highlights the selected server).
  $('.server-list').on('click', 'tr', function() {
    $('.selected-server').removeClass('selected-server');
    $(this).addClass('selected-server');
  });

  // Button to go back to menu (doesn't depend on the screen you are).
  $backToMenuButton.click(function() {
    $mainMenuContainer.show();
    $serverSelectionForm.hide();
    $serverCreationForm.hide();
    $serverCreationFormElement.get(0).reset();
    $(this).hide();
  });
}

// Display screen to create a new server and hides others not relevant.
function displayServerCreation() {
  $mainMenuContainer.hide();
  $serverCreationForm.show();
  $backToMenuButton.show();
  $serverNameField.focus();
}

// Request servers from the server and hides other screens.
function requestServers() {
  socket.emit('retrieve-servers');
  $mainMenuContainer.hide();
  $serverSelectionForm.show();
  $backToMenuButton.show();
}


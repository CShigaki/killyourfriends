(function($) {
  var create;
  var browse;
  var createText = 'Create Server >';
  var browseText = 'Browse Servers >';
  var mainMenuGroup;
  var serversGroup;

  var MenuState = {
    create: function () {
      mainMenuGroup = game.add.group();
      serversGroup = game.add.group();
      //var menuBackground = game.add.image(0, 0, 'menu-background');
      // Main menu items.
      create = game.add.text(game.world.centerX - 20, game.world.centerY + 100, createText, { font: '33px Erthqake', fill: '#a5010c' }, mainMenuGroup);
      browse = game.add.text(game.world.centerX - 20, game.world.centerY + 155, browseText, { font: '33px Erthqake', fill: '#a5010c' }, mainMenuGroup);
      create.alpha = 0.7;
      create.inputEnabled = true;
      create.events.onInputDown.add(this.displayServerCreation, this);
      browse.alpha = 0.7;
      browse.inputEnabled = true;
      browse.events.onInputDown.add(this.requestServers, this);

      socket.on('server-list', this.displayServers);

      // Servers listing items. (Not used for now. The server listing will be made using html and not Phaser)

      //game.input.addMoveCallback(this.mouseMove, this);
    },

    requestServers: function() {
      socket.emit('retrieve-servers');
    },

    displayServerCreation: function() {
      $('canvas').hide();
      $('.server-creation').show();
      $('.create-server').click(function() {
        socket.emit('create-server', {
          name: $('.server-name').val(),
          slots: $('.players-slots').val()
        });
      });
    },

    displayServers: function(data) {
      $('canvas').hide();
      $('.server-selection').show();
      $('.server-list').empty();
      data.servers.forEach(function(server) {
        $('.server-list').append('<input type="radio" name="server" value="' + server.serverId + '">' + server.name + '             ' + server.occupiedSlots + '/' + server.slots + '</br>');
      });
      $('.join-server').click(function() {
        $('.server-selection').hide();
        $('canvas').show();
        game.state.start('maingame');
      });
    },
  }
})(jQuery);

var LoadState = {
  preload: function () {
    game.add.text();
    game.load.image('menu-background', '/assets/backgrounds/menu-background.jpg');
    game.load.image('floor1', '/assets/ground/floor.png');
  },

  create: function () {
    game.state.start('menu');
  }
}
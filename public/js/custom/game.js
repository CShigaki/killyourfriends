var socket = io('http://' + window.location.hostname + ':8005');

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

game.state.add('boot', BootState);
game.state.add('load', LoadState);
game.state.add('menu', MenuState);
game.state.add('maingame', MainGameState);

game.state.start('boot');

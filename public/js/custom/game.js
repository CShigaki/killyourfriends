var socket = io('http://' + window.location.hostname + ':8005');
var $ = jQuery;
var scene, camera, renderer, controls;
var clock = new THREE.Clock();
var currentServer = '', playerName = '', currentScene = '';
var SCREEN_WIDTH, SCREEN_HEIGHT;
// camera attributes
var VIEW_ANGLE, ASPECT, NEAR, FAR;

var $registerNameButtonButton, $createServerButtonButton, $browseServersButtonButton, $backToMenuButtonButton, $leaveRoomButtonButton, $joinGameButtonButton, $createGameButton, $readyButton, $startGameButton, $playerNameField, $serverNameField, $mainMenuContainer, $nameSelectionForm, $serverSelectionForm, $serverCreationForm, $serverCreationFormElement, $waitingLobbyForm, $playerListing;

$(document).ready(function() {
  SCREEN_WIDTH = $(window).width();
  // For some reason, even using height() the height it returns is not right.
  SCREEN_HEIGHT = $(window).height() - 3;
  VIEW_ANGLE = 45;
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
  NEAR = 0.1;
  FAR = 20000;
  // Setup all the buttons handlers.
  setupHTMLHandlers();
  // Focus on the player name field.
  $playerNameField.focus();
});

function animate() {
  requestAnimationFrame( animate );
  render();
  update();
}

function update(){
  // delta = change in time since last call (in seconds)
  var delta = clock.getDelta();
}

function render() { 
  renderer.render( scene, camera );
}

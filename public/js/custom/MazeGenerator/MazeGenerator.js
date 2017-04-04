var MazeGenerator = function() {
  this.worker;
  this.path;
  this.maze;
  this.wallsArray = new Array();
  this.horizontalSize;
  this.verticalSize;

  this.generateMaze = function(x, y, xCube, zCube, scene) {
    this.horizontalSize = x;
    this.verticalSize = y;
    maze = this.initializeMaze(x, y, xCube, zCube, scene);
    path = new Array();
    worker = new Worker(x, y, xCube, zCube, maze, scene);

    var initialMovement = true;
    while (initialMovement || (worker.getCurrentTile() != undefined && worker.getCurrentTile().tileId != worker.getInitialTile.tileId)) {
      if (!worker.shouldBacktrack()) {
        var direction = -1;
        while (direction == -1) {
          direction = worker.randomizeDirection();
        }
        worker.removeWalls(direction, worker.getCurrentTile(), this.wallsArray);
      }
      else {
        console.log('No way out. Backtracking. Path length: ' + worker.path.length);
        worker.backtrack();
      }
      initialMovement = false;
    }
  }

  this.getMazeWallsArray = function() {
    return this.wallsArray;
  }

  this.initializeMaze = function(x, y, xCube, zCube, scene) {
    var array = new Array();
    var tileId = 0;
    for (var i = 0; i < y; i++) {
      array[i] = new Array();
      for (var o = 0; o < x; o++) {
        array[i][o] = new Tile(o, i, tileId, scene);
        array[i][o].initializeTile(xCube, zCube, this.wallsArray);
        tileId++;
      }
    }
    return array;
  }

  this.generateRandomColor = function() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
  }

}
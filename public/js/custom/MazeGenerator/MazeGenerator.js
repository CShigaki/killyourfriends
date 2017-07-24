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
    var s = this.getMazeWallsArray();
    console.log(s);
    //console.log(this.countWalls(this.getMazeWallsArray()));
  }

  this.countWalls = function(mazeArray) {
    var numberOfWalls = 0;

    for (var square = 0; square < mazeArray.length; square++) {
      for (var wall = 0; wall < mazeArray[square].length; wall++) {
        numberOfWalls++;
      }
    }
    return numberOfWalls;
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

  this.generateMazeFromWallsArray = function(mazeArray, xCube, zCube, scene) {
    for (var square = 0; square < mazeArray.length; square++) {
      for (var wall = 0; wall < mazeArray[square].length; wall++) {
        var wallGeometry = new THREE.BoxGeometry(xCube, 3, zCube);
        var wallMaterial = new THREE.MeshPhongMaterial( { color: this.generateRandomColor() } ); // yellow
        var wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

        wallMesh.position.set(mazeArray[square][wall][0].x, mazeArray[square][wall][0].y, mazeArray[square][wall][0].z);

        wallMesh.rotation.set(mazeArray[square][wall][1]._x, mazeArray[square][wall][1]._y, mazeArray[square][wall][1]._z, 'XYZ');

        wallMesh.castShadow = true;
        wallMesh.receiveShadow = false;

        scene.add(wallMesh);
      }
    }
  }
}
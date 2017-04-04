var Worker = function(x, y, xCube, zCube, mazeMatrix, scene) {
  this.floorGeometry = new THREE.BoxGeometry(xCube, 0.1, zCube);
  this.floorMaterial = new THREE.MeshBasicMaterial( { color: '#ff0000' } );
  this.bottomMaterial = new THREE.MeshBasicMaterial( { color: '#0000ff' } );
  this.xCube = xCube;
  this.zCube = zCube;
  this.path = new Array();
  this.initialX = 0;
  this.initialY = Math.floor(Math.random() * (y));
  this.maze = mazeMatrix;
  this.path.push(mazeMatrix[this.initialY][this.initialX]);
  this.scene = scene;

  this.getInitialTile = function() {
    return this.path[0];
  }

  this.getCurrentTile = function() {
    return !this.path[this.path.length - 1] ? null : this.path[this.path.length - 1];
  }

  this.shouldBacktrack = function() {
    return this.getCurrentTile().needToBacktrack(this.maze, this.getCurrentTile());
  }

  this.backtrack = function() {
    this.path.splice(-1,1);
    if (this.path.length != 0) {
      this.initialX = this.getCurrentTile().posX;
      this.initialY = this.getCurrentTile().posY;
    }
  }

  this.randomizeDirection = function() {
    var direction = Math.floor(Math.random() * 4);
    if (this.getCurrentTile().checkNeighbour(this.maze, this.getCurrentTile(), direction))
      return direction;
    else
      return -1;
  }

  this.removeWalls = function(direction, currentTile, wallsArray) {
    this.scene.remove(this.getCurrentTile().wallArray[direction]);
    wallsArray[this.getCurrentTile().tileId].splice(direction, 1);
    if (direction == 0 || direction == 2) {
      if (direction == 0) {
        this.path.push(this.maze[this.initialY][this.initialX - 1]);
        this.scene.remove(this.getCurrentTile().wallArray[2]);
        wallsArray[this.getCurrentTile().tileId].splice(2, 1);
        this.initialX--;
      }
      else {
        this.path.push(this.maze[this.initialY][this.initialX + 1]);
        this.scene.remove(this.getCurrentTile().wallArray[0]);
        wallsArray[this.getCurrentTile().tileId].splice(0, 1);
        this.initialX++;
      }
    }
    else if (direction == 1 || direction == 3) {
      if (direction == 1) {
        this.path.push(this.maze[this.initialY - 1][this.initialX]);
        this.scene.remove(this.getCurrentTile().wallArray[3]);
        wallsArray[this.getCurrentTile().tileId].splice(3, 1);
        this.initialY--;
      }
      else {
        this.path.push(this.maze[this.initialY + 1][this.initialX]);
        this.scene.remove(this.getCurrentTile().wallArray[1]);
        wallsArray[this.getCurrentTile().tileId].splice(1, 1);
        this.initialY++;
      }
    }
    this.getCurrentTile().visited = true;
  }
}
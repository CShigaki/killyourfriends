var Tile = function(posX, posY, tileId, scene) {
  this.tileId = tileId;
  this.visited = false;
  this.wallArray = new Array();
  this.posX = posX;
  this.posY = posY;
  this.scene = scene;
  this.initializeTile = function(xCube, zCube, wallsArray) {
    var floorGeometry = new THREE.BoxGeometry(xCube, 3, zCube);
    var floorMaterial = new THREE.MeshPhongMaterial( { color: '#ff0000' } ); // red
    var leftWallMaterial = new THREE.MeshPhongMaterial( { color: '#ffa500' } ); // orange
    var rightWallMaterial = new THREE.MeshPhongMaterial( { color: '#ffff00' } ); // yellow
    var downWallMaterial = new THREE.MeshPhongMaterial( { color: '#551a8b' } ); // purple
    var topWallMaterial = new THREE.MeshPhongMaterial( { color: '#00ff00' } ); // green

    var wallTop = new THREE.Mesh(floorGeometry, topWallMaterial);
    wallTop.position.set((this.posX * xCube), zCube / 2, this.posY * zCube - zCube);

    var wallDown = new THREE.Mesh(floorGeometry, downWallMaterial);
    wallDown.position.set((this.posX * xCube), zCube / 2, (this.posY * zCube));

    var wallLeft = new THREE.Mesh(floorGeometry, leftWallMaterial);
    wallLeft.position.set((this.posX * xCube) - xCube / 2, zCube / 2, this.posY * zCube - (zCube / 2));

    var wallRight = new THREE.Mesh(floorGeometry, rightWallMaterial);
    wallRight.position.set((this.posX * xCube) + xCube / 2, zCube / 2, this.posY * zCube - (zCube / 2));

    wallTop.rotation.x = Math.PI / 2;
    wallDown.rotation.x = Math.PI / 2;
    wallTop.position.z += zCube / 2;
    wallDown.position.z += zCube / 2;

    wallLeft.rotation.z = Math.PI / 2;
    wallRight.rotation.z = Math.PI / 2;
    wallLeft.position.z += zCube / 2;
    wallRight.position.z += zCube / 2;

    wallTop.castShadow = true;
    wallTop.receiveShadow = false;
    wallDown.castShadow = true;
    wallDown.receiveShadow = false;
    wallLeft.castShadow = true;
    wallLeft.receiveShadow = false;
    wallRight.castShadow = true;
    wallRight.receiveShadow = false;

    this.wallArray[0] = wallLeft;
    this.wallArray[1] = wallTop;
    this.wallArray[2] = wallRight;
    this.wallArray[3] = wallDown;

    this.scene.add(wallLeft);
    this.scene.add(wallTop);
    this.scene.add(wallRight);
    this.scene.add(wallDown);
    
    wallsArray[this.tileId] = [
        [
          wallLeft.position,
          wallLeft.rotation,
        ],
        [
          wallTop.position,
          wallTop.rotation,
        ],
        [
          wallRight.position,
          wallRight.rotation,
        ],
        [
          wallDown.position,
          wallDown.rotation,
        ]
    ];
  }

  this.needToBacktrack = function(maze, currentTile) {
    if ((maze[currentTile.posY][currentTile.posX + 1] == undefined || maze[currentTile.posY][currentTile.posX + 1].visited) &&
        (maze[currentTile.posY][currentTile.posX - 1] == undefined || maze[currentTile.posY][currentTile.posX - 1].visited) &&
        (maze[currentTile.posY + 1] == undefined || maze[currentTile.posY + 1][currentTile.posX].visited) &&
        (maze[currentTile.posY - 1] == undefined || maze[currentTile.posY - 1][currentTile.posX].visited)) {
      return true;
    }
    return false;
  }

  this.checkNeighbour = function(maze, currentTile, index) {
    switch (index) {
      case 0:
        if (maze[currentTile.posY][currentTile.posX - 1] == undefined || maze[currentTile.posY][currentTile.posX - 1].visited)
          return false;
        else
          return true;

        break;
      case 1:
        if (maze[currentTile.posY - 1] == undefined || maze[currentTile.posY - 1][currentTile.posX].visited)
          return false;
        else
          return true;

        break;
      case 2:
        if (maze[currentTile.posY][currentTile.posX + 1] == undefined || maze[currentTile.posY][currentTile.posX + 1].visited)
          return false;
        else
          return true;

        break;
      case 3:
        if (maze[currentTile.posY + 1] == undefined || maze[currentTile.posY + 1][currentTile.posX].visited)
          return false;
        else
          return true;

        break;
    }
  }
}
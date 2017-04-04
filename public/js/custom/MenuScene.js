function initMenuScene() {
  currentScene = 'menu';
  ///////////
  // SCENE //
  ///////////
  scene = new THREE.Scene();
  ////////////
  // CAMERA //
  ////////////
  
  // set up camera
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  // add the camera to the scene
  scene.add(camera);
  // the camera defaults to position (0,0,0)
  //  so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
  camera.position.set(0,300,200);
  camera.lookAt(scene.position);
  //////////////
  // RENDERER //
  //////////////
  // create and start the renderer; choose antialias setting.
  renderer = new THREE.WebGLRenderer( {antialias:true} );
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );
  //////////////
  // CONTROLS //
  //////////////
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render ); // remove when using animation loop
  controls.enableZoom = true;
  ///////////
  // LIGHT //
  ///////////
  /*var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 100, 100, 300 );
  spotLight.castShadow = true;*/
  /*spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add( spotLight );
  var helper = new THREE.CameraHelper( light1.shadow.camera );
  scene.add( helper );*/
  /*var light1 = new THREE.PointLight( '#ffffff', 8, 200, 1 );
  light1.position.set(50, 150, 50);
  scene.add( light1 );*/

  var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
  // create a set of coordinate axes to help orient user
  //    specify length in pixels in each direction
  var axes = new THREE.AxisHelper(100);
  scene.add( axes );
  // fog must be added to scene before first render
  scene.fog = new THREE.FogExp2( 0x999e9ff, 0.0005 );
}
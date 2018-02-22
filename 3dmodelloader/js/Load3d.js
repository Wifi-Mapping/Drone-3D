if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, clock, controls;
var camera, scene, renderer, mixer;

init();
animate();

function init() {

	var filepath = './models/stormtrooper/stormtrooper.dae';
	//var filepath = './models/elf/elf.dae';

	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 15, 10, - 15 );

	scene = new THREE.Scene();

	clock = new THREE.Clock();

	var loader = new THREE.ColladaLoader();
	loader.load( filepath, function ( collada ) {

		var animations = collada.animations;
		var avatar = collada.scene;

		mixer = new THREE.AnimationMixer( avatar );

		try {
			var action = mixer.clipAction( animations[ 0 ] ).play();
		}
		finally {
			scene.add( avatar );
		}
	} );

	scene.background = new THREE.Color( 0xffffff );

	var ambientLight = new THREE.AmbientLight( 0xe0e0e0, 0.4 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
	directionalLight.position.set( -5, 0, -5 );
	scene.add( directionalLight );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 3, 0 );
	controls.update();

	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	controls.update()
	render();
}

function render() {
	var delta = clock.getDelta();

	if ( mixer !== undefined ) {
		mixer.update( delta );
	}

	renderer.render( scene, camera );
}
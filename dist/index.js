import * as THREE from "./threejsFiles/three.module.js";
import {GLTFLoader} from "./threejsFiles/GLTFLoader.js";
// import {FBXLoader} from "./threejsFiles/FBXLoader.js";
import {OrbitControls} from "./threejsFiles/OrbitControls.js";

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();

var model;

const loader = new GLTFLoader();
loader.load(
	"assets/IP13PROOR.glb",
	function (glb) {
		console.log(glb);
		// const loader = new FBXLoader();
		// loader.load(
		// 	"assets/fbx/Common_kingfisher_fly.fbx",
		// 	function (object) {
		// 		console.log(object);
		model = glb.scene;
		const root = glb.scene;
		root.scale.set(0.2, 0.2, 0.2);
		scene.add(root);
	},
	function (xhr) {
		console.log((xhr.loader / xhr.total) * 100 + "% loaded");
	},
	function (error) {
		console.log("An error occured!" + error);
	}
);

const hlight = new THREE.AmbientLight(0x404040, 7);
scene.add(hlight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

const light = new THREE.PointLight(0xc4c4c4, 5);
light.position.set(0, 300, 500);
scene.add(light);

const light2 = new THREE.PointLight(0xc4c4c4, 5);
light2.position.set(500, 100, 0);
scene.add(light2);

const light3 = new THREE.PointLight(0xc4c4c4, 5);
light3.position.set(0, 100, -500);
scene.add(light3);

const light4 = new THREE.PointLight(0xc4c4c4, 5);
light4.position.set(-500, 300, 500);
scene.add(light4);

// boiler plate code
const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
	750,
	size.width / size.height,
	0.1,
	100
);
camera.position.set(0, 0, 1);

const renderer = new THREE.WebGL1Renderer({
	canvas: canvas,
	alpha: true,
});

renderer.setSize(size.width, size.height);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.gamaOutput = true;
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

const clock = new THREE.Clock();

var rotationFactor = -0.2;
var stopRotation = false;
var currRotation;
canvas.addEventListener("pointerdown", OnMouseDown);
canvas.addEventListener("mouseup", OnMouseUp);

function OnMouseDown() {
	console.log("down");
	clock.stop();
	stopRotation = true;
	currRotation = model.rotation.y;
}

function OnMouseUp() {
	console.log("up");
	clock.start();
	stopRotation = false;
}

function animate() {
	requestAnimationFrame(animate);

	const canvas = renderer.domElement;
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();

	const elapsedTime = clock.getElapsedTime();
	currRotation = model.rotation.y;
	if (!stopRotation) {
		model.rotation.y = rotationFactor * elapsedTime;
		// currRotation = model.rotation.y
	}
	renderer.render(scene, camera);
}
animate();

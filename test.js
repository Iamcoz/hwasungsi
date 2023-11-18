import * as THREE from './threejsFiles/three.module.js';
import {OrbitControls} from './threejsFiles/OrbitControls.js';
import {FBXLoader} from './threejsFiles/FBXLoader.js';

//where is cnanvas?
const canvas = document.querySelector('.webgl');

//create scene
const scene = new THREE.Scene();

//create multiple mo
var model;

const loader = new FBXLoader();
loader.load(
  'assets/fbx/Common_kingfisher_fly.fbx',
  function (fbx) {
    scene.add(fbx);
  },
  'assets/fbx/frog_jump.fbx',
  function (fbx) {
    console.log(fbx);
    scene.add(fbx);
  },
  function (xhr) {
    console.log((xhr.loader / xhr.total) * 100 + '% loaded');
  },
  function (error) {
    console.log('An error occured!' + error);
  },
);
//create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0);

//create light
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

//create renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.gamaOutput = true;
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0);
controls.update();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();

  // stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
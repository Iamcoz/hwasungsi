//import three.js modules
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
  //what if there are more than one model to load?
  //please answer me
  function (fbx) {
    console.log(fbx);
    // model = fbx.scene;
    // const root = fbx.scene;
    // root.scale.set(0.1, 0.1, 0.1);
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

// import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
// import {TrackballControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/TrackballControls.js';

// // Main function to set up the scenes and render loop
// function main() {
//   // Create a canvas element for rendering
//   const canvas = document.querySelector('webgl1');
//   const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
//   renderer.setScissorTest(true); // Enable scissor testing for multiple scenes

//   // An array to store scene elements and rendering functions
//   const sceneElements = [];

//   // Function to add a scene to a given element
//   function addScene(elem, fn) {
//     const ctx = document.querySelector('canvas').getContext('2d');
//     elem.appendChild(ctx.canvas);
//     sceneElements.push({elem, ctx, fn});
//   }

//   // Function to create a scene with camera and controls
//   function makeScene(elem) {
//     const scene = new THREE.Scene();
//     const fov = 45;
//     const aspect = 2;
//     const near = 0.1;
//     const far = 2;
//     const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//     camera.position.set(0, 1, 2);
//     camera.lookAt(0, 0, 0);
//     scene.add(camera);

//     const controls = new TrackballControls(camera, elem);
//     controls.noZoom = true;
//     controls.noPan = true;

//     // Add directional light to the scene
//     const color = 0xffffff;
//     const intensity = 1;
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(-1, 2, 4);
//     scene.add(light);

//     return {scene, camera, controls};
//   }

//   // Scene initialization functions for different diagrams
//   const sceneInitFunctionsByName = {
//     box: (elem) => {
//       const {scene, camera, controls} = makeScene(elem);
//       const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
//       const material = new THREE.MeshPhongMaterial({color: 'red'});
//       const mesh = new THREE.Mesh(geometry, material);
//       scene.add(mesh);
//       return (time, rect) => {
//         mesh.rotation.y = time * 0.1;
//         camera.aspect = rect.width / rect.height;
//         camera.updateProjectionMatrix();
//         controls.handleResize();
//         controls.update();
//         renderer.render(scene, camera);
//       };
//     },
//     pyramid: (elem) => {
//       const {scene, camera, controls} = makeScene(elem);
//       const radius = 0.8;
//       const widthSegments = 4;
//       const heightSegments = 2;
//       const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
//       const material = new THREE.MeshPhongMaterial({
//         color: 'blue',
//         flatShading: true,
//       });
//       const mesh = new THREE.Mesh(geometry, material);
//       scene.add(mesh);
//       return (time, rect) => {
//         mesh.rotation.y = time * 0.1;
//         camera.aspect = rect.width / rect.height;
//         camera.updateProjectionMatrix();
//         controls.handleResize();
//         controls.update();
//         renderer.render(scene, camera);
//       };
//     },
//   };

//   // Initialize scenes and rendering functions for each diagram
//   document.querySelectorAll('[data-diagram]').forEach((elem) => {
//     const sceneName = elem.dataset.diagram;
//     const sceneInitFunction = sceneInitFunctionsByName[sceneName];
//     const sceneRenderFunction = sceneInitFunction(elem);
//     addScene(elem, sceneRenderFunction);
//   });

//   // Render loop function
//   function render(time) {
//     time *= 0.001;

//     for (const {elem, fn, ctx} of sceneElements) {
//       const rect = elem.getBoundingClientRect();
//       const {left, right, top, bottom, width, height} = rect;
//       const rendererCanvas = renderer.domElement;

//       const isOffscreen = bottom < 0 || top > window.innerHeight || right < 0 || left > window.innerWidth;

//       if (!isOffscreen) {
//         if (rendererCanvas.width < width || rendererCanvas.height < height) {
//           renderer.setSize(width, height, false);
//         }

//         if (ctx.canvas.width !== width || ctx.canvas.height !== height) {
//           ctx.canvas.width = width;
//           ctx.canvas.height = height;
//         }

//         renderer.setScissor(0, 0, width, height);
//         renderer.setViewport(0, 0, width, height);

//         fn(time, rect);

//         ctx.globalCompositeOperation = 'copy';
//         ctx.drawImage(rendererCanvas, 0, rendererCanvas.height - height, width, height, 0, 0, width, height);
//       }
//     }

//     requestAnimationFrame(render);
//   }

//   // Start the render loop
//   requestAnimationFrame(render);
// }

// // Call the main function to set up scenes and start rendering
// main();

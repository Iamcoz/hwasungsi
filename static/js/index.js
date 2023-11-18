import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import {TrackballControls} from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/TrackballControls.js";
import {FBXLoader} from "./static/threejsFiles/FBXLoader.js";

function main() {
	// Create a canvas element for rendering
	const canvas = document.createElement("canvas");
	const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
	renderer.setScissorTest(true); // Enable scissor testing for multiple scenes
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.toneMapping = THREE.ReinhardToneMapping;
	renderer.toneMappingExposure = 2.3;
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.shadowMap.enabled = true;
	renderer.gamaOutput = true;

	// An array to store scene elements and rendering functions
	const sceneElements = [];

	// Function to add a scene to a given element
	function addScene(elem, fn) {
		const ctx = document.createElement("canvas").getContext("2d");
		elem.appendChild(ctx.canvas);
		sceneElements.push({elem, ctx, fn});
		console.log(sceneElements);
	}

	// Function to create a scene with camera and controls
	function makeScene(elem) {
		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight,
			0.3,
			1000
		);
		camera.position.set(-1, 1.5, 1.3);

		camera.lookAt(0, 0, 0);
		scene.add(camera);

		const controls = new TrackballControls(camera, elem);
		controls.noZoom = true;
		controls.noPan = true;

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

		return {scene, camera, controls};
	}

	const clock = new THREE.Clock();
	var stopRotation = false;
	var currRotation;
	console.log(canvas);
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
	// Scene initialization functions for different diagrams
	const sceneInitFunctionsByName = {
		bird: (elem) => {
			console.log(elem);
			const {scene, camera, controls} = makeScene(elem);
			const loader = new FBXLoader();

			return new Promise((resolve) => {
				loader.load("assets/fbx/Common_kingfisher_fly.fbx", (fbx) => {
					console.log(fbx);
					const model = fbx;
					model.scale.set(0.027, 0.027, 0.027);
					scene.add(model);
					resolve((time, rect) => {
						model.rotation.y = time * -0.15;
						camera.aspect = rect.width / rect.height;
						camera.updateProjectionMatrix();
						controls.handleResize();
						controls.update();
						renderer.render(scene, camera);
					});
				});
			});
		},
		frog: (elem) => {
			console.log(elem);
			const {scene, camera, controls} = makeScene(elem);

			const loader = new FBXLoader();

			return new Promise((resolve) => {
				loader.load("assets/fbx/frog_jump.fbx", (fbx) => {
					console.log(fbx);
					const model = fbx;
					model.scale.set(0.03, 0.03, 0.03);
					scene.add(model);
					resolve((time, rect) => {
						model.rotation.y = time * 0.15;
						camera.aspect = rect.width / rect.height;
						camera.updateProjectionMatrix();
						controls.handleResize();
						controls.update();
						renderer.render(scene, camera);
					});
				});
			});
		},
		otter: (elem) => {
			console.log(elem);
			const {scene, camera, controls} = makeScene(elem);

			const loader = new FBXLoader();

			return new Promise((resolve) => {
				loader.load("assets/fbx/otter_idle.fbx", (fbx) => {
					console.log(fbx);
					const model = fbx;
					model.scale.set(0.01, 0.01, 0.01);
					scene.add(model);
					resolve((time, rect) => {
						model.rotation.y = time * 0.2;
						camera.aspect = rect.width / rect.height;
						camera.updateProjectionMatrix();
						controls.handleResize();
						controls.update();
						renderer.render(scene, camera);
					});
				});
			});
		},
		dragon_fly: (elem) => {
			console.log(elem);
			const {scene, camera, controls} = makeScene(elem);

			const loader = new FBXLoader();

			return new Promise((resolve) => {
				loader.load("assets/fbx/dragonfly_idle.fbx", (fbx) => {
					console.log(fbx);
					const model = fbx;
					model.scale.set(0.08, 0.08, 0.08);
					scene.add(model);
					resolve((time, rect) => {
						model.rotation.y = time * -0.1;
						camera.aspect = rect.width / rect.height;
						camera.updateProjectionMatrix();
						controls.handleResize();
						controls.update();
						renderer.render(scene, camera);
					});
				});
			});
		},
	};

	// Initialize scenes and rendering functions for each diagram

	const loadPromises = [];
	const sceneRenderFunctions = [];
	document.querySelectorAll("[data-diagram]").forEach((elem) => {
		const sceneName = elem.dataset.diagram;
		console.log("Selected scene:", sceneName);
		const sceneInitFunction = sceneInitFunctionsByName[sceneName];
		console.log(sceneInitFunction);
		if (sceneInitFunction) {
			const loadPromise = sceneInitFunction(elem);
			console.log(elem);
			loadPromises.push(loadPromise);

			// Store the rendering function in the sceneRenderFunctions array
			loadPromise.then((renderFunction) => {
				sceneRenderFunctions.push(renderFunction);
			});
			addScene(elem, sceneRenderFunctions);
		} else {
			console.error("Scene initialization function not found for:", sceneName);
		}
	});

	// Render loop function
	Promise.all(loadPromises).then(() => {
		function render(time) {
			time *= 0.001;
			for (let i = 0; i < sceneElements.length; i++) {
				const {elem, ctx} = sceneElements[i];
				const rect = elem.getBoundingClientRect();
				const {left, right, top, bottom, width, height} = rect;
				const rendererCanvas = renderer.domElement;

				const isOffscreen =
					bottom < 0 ||
					top > window.innerHeight ||
					right < 0 ||
					left > window.innerWidth;

				if (!isOffscreen) {
					if (rendererCanvas.width < width || rendererCanvas.height < height) {
						renderer.setSize(width, height, false);
					}

					if (ctx.canvas.width !== width || ctx.canvas.height !== height) {
						ctx.canvas.width = width;
						ctx.canvas.height = height;
					}

					renderer.setScissor(0, 0, width, height);
					renderer.setViewport(0, 0, width, height);

					// Use the corresponding sceneRenderFunction for rendering
					const sceneRenderFunction = sceneRenderFunctions[i];
					if (sceneRenderFunction) {
						sceneRenderFunction(time, rect);
					}

					ctx.globalCompositeOperation = "copy";
					ctx.drawImage(
						rendererCanvas,
						0,
						rendererCanvas.height - height,
						width,
						height,
						0,
						0,
						width,
						height
					);
				}
			}

			requestAnimationFrame(render);
		}

		// Start the render loop
		requestAnimationFrame(render);
	});
}

// Call the main function to set up scenes and start rendering
main();

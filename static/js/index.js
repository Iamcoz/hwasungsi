// import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
// import {TrackballControls} from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/TrackballControls.js";

function main() {
    // Create a canvas element for rendering
    const canvas = document.createElement("canvas");
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
    renderer.setScissorTest(true);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.gamaOutput = true;

    const sceneElements = [];

    function addScene(elem, fn) {
        const ctx = document.createElement("canvas").getContext("2d");
        elem.appendChild(ctx.canvas);
        sceneElements.push({elem, ctx, fn});
    }

    function makeScene(elem) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.3, 1000);
        camera.position.set(-1, 1.5, 1.3);
        camera.lookAt(0, 0, 0);
        scene.add(camera);

        const controls = new TrackballControls(camera, elem);
        controls.noZoom = true;
        controls.noPan = true;

        // Lights
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
    canvas.addEventListener("pointerdown", OnMouseDown);
    canvas.addEventListener("mouseup", OnMouseUp);
    function OnMouseDown() {
        clock.stop();
        stopRotation = true;
        currRotation = model.rotation.y;
    }

    function OnMouseUp() {
        clock.start();
        stopRotation = false;
    }

    // Scene initialization functions for different diagrams (Now empty as FBXLoader is removed)
    const sceneInitFunctionsByName = {
        // Add scene initialization functions here as needed
    };

    // Initialize scenes and rendering functions for each diagram
    const loadPromises = [];
    const sceneRenderFunctions = [];
    document.querySelectorAll("[data-diagram]").forEach((elem) => {
        const sceneName = elem.dataset.diagram;
        const sceneInitFunction = sceneInitFunctionsByName[sceneName];
        if (sceneInitFunction) {
            const loadPromise = sceneInitFunction(elem);
            loadPromises.push(loadPromise);
            loadPromise.then((renderFunction) => {
                sceneRenderFunctions.push(renderFunction);
            });
            addScene(elem, sceneRenderFunctions);
        }
    });

    // Render loop function
    Promise.all(loadPromises).then(() => {
        function render(time) {
            time *= 0.001;
            // Render logic here
        }

        requestAnimationFrame(render);
    });
}

main();

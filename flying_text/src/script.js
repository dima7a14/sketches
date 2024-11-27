import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();
const debugObject = {
	acceleration: 0.1,
};

gui.add(debugObject, "acceleration").min(0).max(1).step(0.001);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
// const matcapTexture = textureLoader.load("/textures/matcaps/7.png");
// matcapTexture.colorSpace = THREE.SRGBColorSpace;
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

// const material = new THREE.MeshMatcapMaterial({
// 	matcap: matcapTexture,
// });
const material = new THREE.MeshToonMaterial({ color: 0xaa9cf6 });
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMinimaps = false;
material.gradientMap = gradientTexture;

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.set(0, 2, 1);
scene.add(pointLight);

const objects = [];
const chars = "abcdefghjklmnopqrstuvwxyz0123456789".split("");

const fontLoader = new FontLoader();
fontLoader.load("/fonts/bangers_regular.typeface.json", (font) => {
	console.log("font loaded");
	const textGeometry = new TextGeometry("Wow!", {
		font,
		size: 0.5,
		depth: 0.1,
		curveSegments: 1,
		bevelEnabled: false,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 5,
	});
	textGeometry.center();

	const text = new THREE.Mesh(textGeometry, material);
	scene.add(text);

	for (let i = 0; i < 1000; i++) {
		const char = chars[Math.floor(randomBetween(0, chars.length))];
		const geometry = new TextGeometry(char, {
			font,
			size: randomBetween(0.1, 0.5),
			depth: randomBetween(0.001, 0.1),
			curveSegments: 1,
			bevelEnabled: false,
		});
		geometry.center();
		const object = new THREE.Mesh(geometry, material);
		object.position.set(
			(Math.random() - 0.5) * 10,
			(Math.random() - 0.5) * 10,
			(Math.random() - 0.5) * 10
		);
		object.rotation.x = Math.random() * Math.PI;
		object.rotation.y = Math.random() * Math.PI;
		const scale = Math.random();
		object.scale.set(scale, scale, scale);

		object.speed = randomBetween(-10, 10);
		object.direction = Math.random() - 0.5 >= 0 ? 1 : -1;
		// object.direction = 1;
		object.initialPosition = {
			x: object.position.x,
			y: object.position.y,
			z: object.position.z,
		};
		objects.push(object);
		scene.add(object);
	}
});

/**
 * Objects
 */
// const objects = [];
// const geometry = new THREE.SphereGeometry(0.1, 20, 20);
// const chars = "abcdefghjklmnopqrstuvwxyz0123456789".split("");

// for (let i = 0; i < 1000; i++) {
//     const geometry = new TextGeometry(chars[randomBetween(0, chars.length)], {
// 		font,
// 		size: 0.25,
// 		depth: 0.1,
// 		curveSegments: 1,
// 		bevelEnabled: false,
// 	});
// 	geometry.center();
// 	const object = new THREE.Mesh(geometry, material);
// 	object.position.set(
// 		(Math.random() - 0.5) * 10,
// 		(Math.random() - 0.5) * 10,
// 		(Math.random() - 0.5) * 10
// 	);
// 	object.rotation.x = Math.random() * Math.PI;
// 	object.rotation.y = Math.random() * Math.PI;
// 	const scale = Math.random();
// 	object.scale.set(scale, scale, scale);

// 	object.speed = randomBetween(-10, 10);
// 	object.direction = Math.random() - 0.5 >= 0 ? 1 : -1;
// 	// object.direction = 1;
// 	object.initialPosition = {
// 		x: object.position.x,
// 		y: object.position.y,
// 		z: object.position.z,
// 	};
// 	objects.push(object);
// 	scene.add(object);
// }
/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const initialTime = Date.now();
let time = initialTime;
const clock = new THREE.Clock();

const tick = () => {
	const currentTime = Date.now();
	const deltaTime = currentTime - time;
	time = currentTime;
	const elapsedTime = time - initialTime;
	// const clockElapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// console.log(elapsedTime, clockElapsedTime);

	// Animate objects
	for (let i = 0; i < objects.length; i++) {
		const object = objects[i];
		const acceleration = debugObject.acceleration;
		object.position.x =
			object.initialPosition.x +
			object.direction *
				Math.cos(object.speed + (acceleration * elapsedTime) / 100);
		object.position.z =
			object.initialPosition.z +
			object.direction *
				Math.sin(object.speed + (acceleration * elapsedTime) / 100);

		let y = object.position.y + (acceleration / 1000) * deltaTime;

		if (y > 5) {
			y = -5;
		}
		object.position.y = y;
	}

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

function randomBetween(min, max) {
	return Math.random() * (max - min) + min;
}

tick();

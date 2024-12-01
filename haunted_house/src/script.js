import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import { Sky } from "three/addons/objects/Sky.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg");

const floorColorTexture = textureLoader.load(
	"./floor/textures/coast_sand_rocks_02_diff_1k.jpg"
);
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
floorColorTexture.repeat.set(8, 8);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

const floorARMTexture = textureLoader.load(
	"./floor/textures/coast_sand_rocks_02_arm_1k.jpg"
);
floorARMTexture.repeat.set(8, 8);
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

const floorNormalTexture = textureLoader.load(
	"./floor/textures/coast_sand_rocks_02_nor_gl_1k.jpg"
);
floorNormalTexture.repeat.set(8, 8);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

const floorDisplacementTexture = textureLoader.load(
	"./floor/textures/coast_sand_rocks_02_disp_1k.jpg"
);
floorDisplacementTexture.repeat.set(8, 8);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Walls
const wallColorTexture = textureLoader.load(
	"./wall/textures/brick_wall_04_diff_1k.jpg"
);
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

const wallARMTexture = textureLoader.load(
	"./wall/textures/brick_wall_04_arm_1k.jpg"
);

const wallNormalTexture = textureLoader.load(
	"./wall/textures/brick_wall_04_nor_gl_1k.jpg"
);

const wallDisplacementTexture = textureLoader.load(
	"./wall/textures/brick_wall_04_disp_1k.jpg"
);

// Roof
const roofColorTexture = textureLoader.load(
	"./roof/textures/roof_tiles_14_diff_1k.jpg"
);
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
roofColorTexture.repeat.set(9, 3);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapT = THREE.RepeatWrapping;

const roofARMTexture = textureLoader.load(
	"./roof/textures/roof_tiles_14_arm_1k.jpg"
);
roofARMTexture.repeat.set(9, 3);
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapT = THREE.RepeatWrapping;

const roofNormalTexture = textureLoader.load(
	"./roof/textures/roof_tiles_14_nor_gl_1k.jpg"
);
roofNormalTexture.repeat.set(9, 3);
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;

// Bush
const bushColorTexture = textureLoader.load(
	"./bush/textures/leaves_forest_ground_diff_1k.jpg"
);
bushColorTexture.colorSpace = THREE.SRGBColorSpace;
bushColorTexture.repeat.set(2, 1);
bushColorTexture.wrapS = THREE.RepeatWrapping;

const bushARMTexture = textureLoader.load(
	"./bush/textures/leaves_forest_ground_arm_1k.jpg"
);
bushARMTexture.repeat.set(2, 1);
bushARMTexture.wrapS = THREE.RepeatWrapping;

const bushNormalTexture = textureLoader.load(
	"./bush/textures/leaves_forest_ground_nor_gl_1k.jpg"
);
bushNormalTexture.repeat.set(2, 1);
bushNormalTexture.wrapS = THREE.RepeatWrapping;

// Grave
const graveColorTexture = textureLoader.load(
	"./grave/textures/plastered_stone_wall_diff_1k.jpg"
);
graveColorTexture.colorSpace = THREE.SRGBColorSpace;
graveColorTexture.repeat.set(0.3, 0.4);

const graveARMTexture = textureLoader.load(
	"./grave/textures/plastered_stone_wall_arm_1k.jpg"
);
graveARMTexture.repeat.set(0.3, 0.4);

const graveNormalTexture = textureLoader.load(
	"./grave/textures/plastered_stone_wall_nor_gl_1k.jpg"
);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door
const doorColorTexture = textureLoader.load("./door/textures/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorAlphaTexture = textureLoader.load("./door/textures/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
	"./door/textures/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./door/textures/height.jpg");
const doorNormalTexture = textureLoader.load("./door/textures/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
	"./door/textures/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
	"./door/textures/roughness.jpg"
);

/**
 * House
 */

const WIDTH = 20;
const HEIGHT = 20;

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(WIDTH, HEIGHT, 100, 100),
	new THREE.MeshStandardMaterial({
		alphaMap: floorAlphaTexture,
		transparent: true,
		map: floorColorTexture,
		aoMap: floorARMTexture,
		roughnessMap: floorARMTexture,
		metalnessMap: floorARMTexture,
		normalMap: floorNormalTexture,
		displacementMap: floorDisplacementTexture,
		displacementScale: 0.3,
		displacementBias: -0.2,
	})
);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4, 100, 100),
	new THREE.MeshStandardMaterial({
		map: wallColorTexture,
		aoMap: wallARMTexture,
		roughnessMap: wallARMTexture,
		metalnessMap: wallARMTexture,
		normalMap: wallNormalTexture,
		displacementMap: wallDisplacementTexture,
		displacementScale: 0.05,
		displacementBias: -0.035,
	})
);

walls.position.y += 2.5 / 2;
walls.castShadow = true;
walls.receiveShadow = true;
house.add(walls);

const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1.5, 4),
	new THREE.MeshStandardMaterial({
		map: roofColorTexture,
		aoMap: roofARMTexture,
		roughnessMap: roofARMTexture,
		metalnessMap: roofARMTexture,
		normalMap: roofNormalTexture,
	})
);
roof.position.y = 2.5 + 1.5 / 2;
roof.rotation.y = Math.PI / 4;
roof.castShadow = true;
roof.castShadow = true;
house.add(roof);

const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		map: doorColorTexture,
		transparent: true,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcclusionTexture,
		displacementMap: doorHeightTexture,
		displacementScale: 0.15,
		displacementBias: -0.04,
		normalMap: doorNormalTexture,
		metalnessMap: doorMetalnessTexture,
		roughnessMap: doorRoughnessTexture,
	})
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
	color: "#ffffee",
	map: bushColorTexture,
	aoMap: bushARMTexture,
	roughnessMap: bushARMTexture,
	metalnessMap: bushARMTexture,
	normalMap: bushNormalTexture,
});

function createBush({ position, scale }) {
	const bush = new THREE.Mesh(bushGeometry, bushMaterial);
	bush.scale.setScalar(scale);
	bush.position.set(position.x, position.y, position.z);
	bush.rotation.x = -0.75;
	house.add(bush);
}

createBush({ scale: 0.5, position: { x: 0.8, y: 0.2, z: 2.2 } });
createBush({ scale: 0.25, position: { x: 1.4, y: 0.1, z: 2.1 } });
createBush({ scale: 0.4, position: { x: -0.8, y: 0.1, z: 2.2 } });
createBush({ scale: 0.15, position: { x: -1, y: 0.05, z: 2.6 } });

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
	map: graveColorTexture,
	aoMap: graveARMTexture,
	roughnessMap: graveARMTexture,
	metalnessMap: graveARMTexture,
	normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);
const GRAVES_COUNT = 30;

for (let i = 0; i < GRAVES_COUNT; i++) {
	const angle = Math.random() * Math.PI * 2;
	const radius = 3 + Math.random() * 4;
	const x = Math.sin(angle) * radius;
	const z = Math.cos(angle) * radius;

	const grave = new THREE.Mesh(graveGeometry, graveMaterial);
	grave.position.x = x;
	grave.position.y = Math.random() * 0.4;
	grave.position.z = z;
	grave.rotation.x = (Math.random() - 0.5) * 0.2;
	grave.rotation.y = (Math.random() - 0.5) * 0.2;
	grave.rotation.z = (Math.random() - 0.5) * 0.2;
	grave.castShadow = true;
	grave.receiveShadow = true;

	graves.add(grave);
}

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100);
sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);
scene.add(sky);

/**
 * Fog
 */
scene.fog = new THREE.FogExp2("#04343f", 0.1);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

// Ghosts
const ghost1 = new THREE.PointLight("#8800ff", 6);
ghost1.castShadow = true;
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;
const ghost2 = new THREE.PointLight("#ff0088", 6);
ghost2.castShadow = true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;
const ghost3 = new THREE.PointLight("#ff0000", 6);
ghost3.castShadow = true;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

scene.add(ghost1, ghost2, ghost3);

/**
 * Shadows
 */

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
	// Timer
	timer.update();
	const elapsedTime = timer.getElapsed();

	// Ghosts
	const ghost1Angle = elapsedTime * 0.5;
	ghost1.position.x = Math.cos(ghost1Angle) * 4;
	ghost1.position.z = Math.sin(ghost1Angle) * 4;
	ghost1.position.y =
		+Math.sin(ghost1Angle) *
		Math.sin(ghost1Angle * 2.34) *
		Math.sin(ghost1Angle * 3.45);

	const ghost2Angle = -elapsedTime * 0.38;
	ghost2.position.x = Math.cos(ghost2Angle) * 5;
	ghost2.position.z = Math.sin(ghost2Angle) * 5;
	ghost2.position.y =
		Math.sin(ghost2Angle) *
		Math.sin(ghost2Angle * 2.34) *
		Math.sin(ghost2Angle * 3.45);

	const ghost3Angle = elapsedTime * 0.23;
	ghost3.position.x = Math.cos(ghost3Angle) * 6;
	ghost3.position.z = Math.sin(ghost3Angle) * 6;
	ghost3.position.y =
		Math.sin(ghost3Angle) *
		Math.sin(ghost3Angle * 2.34) *
		Math.sin(ghost3Angle * 3.45);

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();

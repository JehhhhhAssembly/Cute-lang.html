import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. SCENE SETUP
const scene = new THREE.Scene();

// 2. CAMERA SETUP
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 5); 

// 3. RENDERER SETUP (Configured for ultra-crisp resolution)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Uses maximum screen capability (like 4K displays)
document.body.appendChild(renderer.domElement);

// 4. LIGHTING FOR REALISM
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); 
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// 5. MOUSE/TOUCH CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

// 6. ANIMATION MIXER & MODEL LOADER
let mixer; 
const loader = new GLTFLoader();

// Make sure your downloaded 3D cat file is named exactly 'cat_model.glb'
loader.load('cat_model.glb', function (gltf) {
    const cat = gltf.scene;
    scene.add(cat);
    cat.position.set(0, 0, 0);

    // Play the cat's embedded moving/walking animations if they exist
    if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(cat);
        const action = mixer.clipAction(gltf.animations[0]); 
        action.play();
    }
}, undefined, function (error) {
    console.error('Error loading the cat model. Ensure cat_model.glb is in the root directory:', error);
});

// 7. REAL-TIME ANIMATION LOOP
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta);
    }

    renderer.render(scene, camera);
}

animate();

// 8. SCREEN RESIZE FIX
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

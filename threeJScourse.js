import './style.css';
import * as geometryData from "./geometry.json";
import * as texturesData from "./textures.json";
import * as THREE from "three"; 
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
 
//textures
import cosmos from "./src/bg_texture.png";
import wood from "./src/test_texture.png"; 

const object3d = new URL('./public/bear_configurator.glb', import.meta.url);

//corners 
function getCoords(room) {  
    let coords = [];
    let corners = geometryData["rooms"][room]["corners"];
    for (let key of corners.keys()) {
        let x_y = [corners[key]["x"], corners[key]["y"]] 
        coords.push(x_y);
        } 
  return coords
}

//walls in rooms
const bedroom = getCoords(0);
const living = getCoords(1);
const closed = getCoords(2);
const kitchen = getCoords(3);

//debug
//console.log(geometryData) 
//console.log(texturesData) 
//console.log(corners) 
//console.log(coords) 
console.log(bedroom, living, closed, kitchen) 

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
//renderer.setClearColor(0xFF00FF);

//scene
const scene = new THREE.Scene();


//textures Loader
const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(cosmos);

// const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([
//     cosmos,
//     cosmos,
//     cosmos,
//     cosmos,
//     cosmos,
//     cosmos
// ]);

//camera
const camera = new THREE.PerspectiveCamera(
    45, 
    window.innerWidth / window.innerHeight,
    0.5, 
    1000
);
camera.position.set(-10, 30, 30);

const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.target.set(0,0,0);
orbit.update();

//props
const axesHelper = new THREE.AxesHelper(5); 
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10);
scene.add(gridHelper); 


//geometry
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00})
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const boxGeometry2 = new THREE.BoxGeometry(4, 4, 4);
const boxMaterial2 = new THREE.MeshBasicMaterial({
    //color: 0x0F00F0,
    //map: textureLoader.load(wood),
})
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(wood)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(cosmos)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(wood)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(cosmos)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(wood)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(cosmos)}),
];
const box2 = new THREE.Mesh(boxGeometry2, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 5);
//box2.material.map = textureLoader.load(wood);


//===========================texturing extruded hape====================
let shape = new THREE.Shape();
shape.moveTo(0,0);
shape.lineTo(0,2);
shape.lineTo(0.5,1.5);
shape.lineTo(1,2);
shape.lineTo(1,0);
shape.lineTo(0.5,0.5);
shape.lineTo(0,0);

let extrudeSettings={amount: 50, bevelEnabled: false, material: 0, extrudeMaterial: 1, steps: 10};
let geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
let mat1 = new THREE.MeshStandardMaterial({color: 0xFF00FF, roughness: 0.1, metalness: 0.4, side: THREE.DoubleSide});
let mat2 = new THREE.MeshStandardMaterial({color: 0x0000FF, roughness: 0.7, metalness: 0, side: THREE.DoubleSide});
let mats = [
    mat1,
    mat2];
let localmesh = new THREE.Mesh(geometry,mats);     
scene.add(localmesh);


//================================================================
const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10); 
const plane2Material = new THREE.MeshStandardMaterial({
    color: 0x00FFFF,
    //side: THREE.DoubleSide,
    wireframe: true,
})
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

//geometry - plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

//geometry - sphere  
const sphereGeometry = new THREE.SphereGeometry(4);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false,
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 0, 0);
sphere.castShadow = true;

//============================
const sphere2Geometry = new THREE.SphereGeometry(4);

const vShader = `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

const fShader = `
        void main() {
            gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
        }
    `;

const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader,
    
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

//light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//==================lights - directional===============
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

//==================lights - spotlight===============
const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

//fog 
//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
//scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

//===================load 3d object==============
const assetLoader = new GLTFLoader();

assetLoader.load(object3d.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-10, 5, 10);
}, undefined, function(error) {
    console.error(error)
})


//gui 
const gui = new dat.GUI();  

const options = {
    sphereColor: "#ffea00", 
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
};

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange(function(e){
    sphere.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1);

gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 1);

let step = 0;

//selectable object 
const sphereId = sphere.id;
box2.name = "box2";

//mouse selection
const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e){
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / this.window.innerHeight) * 2 + 1
});

const rayCaster = new THREE.Raycaster();


//animate
function animate (time) {
    box.rotation.x = time / 1000
    box.rotation.y = time / 1000

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    for(let i = 0; i < intersects.length; i++) {
        if(intersects[i].object.id === sphereId)
            intersects[i].object.material.color.set(0xFF0000);
        
        if(intersects[i].object.name === "box2"){
                intersects[i].object.rotation.x = time / 1000
                intersects[i].object.rotation.y = time / 1000
        }
    };


    plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random(); 
    plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;



    //render scene
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

//resizing window
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



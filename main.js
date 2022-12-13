import './style.css';
import * as geometryData from "./geometry.json";
import * as texturesData from "./textures.json";
import * as THREE from "three";  
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//=====================scene====================
const scene = new THREE.Scene();
//===================renderer===================
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor("#F0DBDB");
//======================camera===================
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight,
    0.5, 1000
);
camera.position.set(-10, 30, 30);
//===================controls=====================
const orbit = new OrbitControls(camera, renderer.domElement); 
orbit.update();
//========================props==================
const axesHelper = new THREE.AxesHelper(20); 
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(10);
scene.add(gridHelper); 
//=======================light======================
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);
//==================textures Loader==============
const textureLoader = new THREE.TextureLoader(); 
let texturesLoaded = getTextures();
//=====================textures=========================
function getTextures() {  
    let texturesUrls = [];
    //console.log(texturesUrls)
    let textures = texturesData["tour"]["rooms"];

    for (let [key, value] of Object.entries(textures)) { 
        //let room_type = value["name"].toLowerCase();
        let textures = textureLoader.load(value["url"]); 
        textures.wrapS = THREE.RepeatWrapping;
        textures.wrapT = THREE.RepeatWrapping; 
        textures.repeat.set(0.1, 0.15); 
        textures.offset.y = (0.25);
        textures.rotation = - Math.PI;
        //texturesUrls.push({room: room_7type, url: room_url})
        texturesUrls.push(textures);
        }
  return texturesUrls
}

//=====================corners===========================
function getCoords(room) {  
    let coords = [];
    let corners = geometryData["rooms"][room]["corners"];
    for (let key of corners.keys()) {
        let x_y = [corners[key]["x"], corners[key]["y"]] 
        coords.push(x_y);
        } 
  return coords
}
//======================walls in rooms==================
const bedroom = getCoords(0);
const living = getCoords(1);
const closed = getCoords(2);
const kitchen = getCoords(3); 
let rooms = [closed, kitchen, bedroom, living]
//  
//===========================debug===================
//console.log(geometryData) 
//console.log(texturesData) 
//console.log(corners)  
//console.log(coords) 
// console.log(rooms) 

//=================================================
function buildFoundation(room, size){
    let shape = new THREE.Shape(); 
    let pos = new THREE.Vector3(); 

    const extrudeSettings = {
        depth: 0.2,
        bevelEnabled: true,
        bevelSements: 1,
        steps: 1,
        bevelSize: 0,
        bevelThickness: 0
    }

    //======================foundation==============
    shape.moveTo(room[0][0] * size, room[0][1] * size);
    for(let i = 0; i < (room.length); i++){  
       shape.lineTo(room[i][0] * size, room[i][1] * size);
    }

    pos.x = 0
    pos.y = 0
    
    let geometry
    geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const material = new THREE.MeshBasicMaterial({ 
        color: "#DBA39A", 
    });
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(pos);
    mesh.rotation.x = -0.5 * Math.PI;
    scene.add(mesh);
}
//======================wallcoordinates=======================
function wallCoords(room) {
    let set = []
    for (let i = 0; i < (room.length); i++){
        set.push([room[i], room[(i + 1)]])
    }

    let last_element = set[set.length - 1];
    if (last_element[1] === undefined ) {
        last_element[1] = room[0]
    } 
    return set
}


//==========================init==============================
function initContruction(room, size, wall_height){
    let coordSet = wallCoords(room);
    //console.log(coordSet)
    for(let wall of coordSet){
        let color;
        let texture;
        let inner_size = new THREE.Vector2(0, 0);
        switch (room) {
            case kitchen: 
                color = "#FFE7CC"; 
                texture = texturesLoaded[0];
                inner_size = [-1, 6];
                break;
            case bedroom: 
                color = "#C7BCA1";
                texture = texturesLoaded[1]; 
                inner_size = [1, -1]
                break;
            case living: 
                color = "#EDDBC0"; 
                texture = texturesLoaded[2];
                inner_size = [2, 2];
                break;  
            case closed: 
                color = "#FFB9B9";
                texture = texturesLoaded[3]; 
                inner_size = [3, -1];
                break; 
            default: 
                color = "#DBA39A";  
                inner_size = [0, 0];
                texture = undefined;
        }
        
        buildWall(wall[0], wall[1], size, wall_height, color, texture, inner_size);   
    }
}
 

//======================wall constructor=====================
function buildWall(
    [wallStarts_x, wallStarts_y], 
    [wallEnds_x, wallEnds_y], 
    size=0.3, height=5, color="#DBA39A", texture, inner_size){
 
    //==================================================================
    let shape = new THREE.Shape();
    let outershape = new THREE.Shape();
    let pos = new THREE.Vector3(); 
    shape.moveTo(wallStarts_x * size, wallStarts_y * size);
    shape.lineTo(wallEnds_x * size, wallEnds_y * size);
    
    outershape.moveTo((wallStarts_x - inner_size[0]) * (size - 0.0003), (wallStarts_y + inner_size[1])  * (size - 0.0003));
    outershape.lineTo((wallEnds_x - inner_size[0]) * (size - 0.0003), (wallEnds_y + inner_size[1]) * (size - 0.0003)); 
    pos.x = 0
    pos.y = 0.2
    pos.z = 0 
    let extrudeSettings={
        bevelSements: 1,
        steps: 2,
        bevelSize: 0,
        bevelThickness: 0, 
        depth: height, 
        amount: 50, 
        bevelEnabled: false, 
        material: 0, 
        extrudeMaterial: 1, 
        steps: 2};
    let innergeometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    let outergeometry = new THREE.ExtrudeGeometry( outershape, extrudeSettings );
    let mat1 = new THREE.MeshBasicMaterial({color: color, side: THREE.DoubleSide});
    let mat2 = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
    let mats = [mat1, mat2];
    let innermesh = new THREE.Mesh(innergeometry, mat1); 
    innermesh.position.copy(pos);
    innermesh.rotation.x = -0.5 * Math.PI;    
    let outermesh = new THREE.Mesh(outergeometry, mat2); 
    outermesh.position.copy(pos);
    outermesh.rotation.x = -0.5 * Math.PI;    
    scene.add(innermesh, outermesh);

}

//==============build house===============
function buildHouse () {
    for(let room of rooms){
        buildFoundation(room, 0.03);
        initContruction(room, 0.03, 5);
    }
}

buildHouse(); 

//========================extras======================
//======================land========================
function createLand(){ 
    const planeGeometry = new THREE.PlaneGeometry(30, 35);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: "#749F82",
        side: THREE.DoubleSide,
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, -0.01, -5);

}

createLand();
//====================animate================
function animate () {  
    renderer.render(scene, camera);
   
}
renderer.setAnimationLoop(animate);

 
// function getCorners() {  
//     let coords = [];
//     let corners = geometryData["corners"];
//     for (let key of corners.keys()) {
//         let x_y = [corners[key]["x"], corners[key]["y"]] 
//         coords.push(x_y);
//         } 
//   return coords
// }

 
//geometry  
// function getRoomVertices (room) {
//     let vertices = [];
//     for(let i = 0; i < room.length; i++){
//         let coordinates = room[i]; 
//         //vertices.push(new THREE.Vector3(coordinates[0], coordinates[1], 1));
//         vertices.push(coordinates[0] / 100, coordinates[1] / 100, 0); 
//     }
//     return vertices
// }
 
// function build () {
//     for(let room of rooms){
//         let geometry = new THREE.BufferGeometry();
//         let vertices =  getRoomVertices(room);
//         let typedArray = Float32Array.from(vertices);

//         geometry.setAttribute( 'position', new THREE.BufferAttribute( typedArray, 3 ) );
//         const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
//         const mesh = new THREE.Mesh( geometry, material );
         
//         scene.add(mesh); 
//     }
// }
// build(); 


 
// //==================lights - spotlight===============
// const spotLight = new THREE.SpotLight(0xFFFFFF);
// scene.add(spotLight);
// spotLight.position.set(-100, 100, 0);
// spotLight.castShadow = true;
// spotLight.angle = 0.2;

// // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// // scene.add(spotLightHelper);



// let wallshape = new THREE.Shape(); 
// let pos = new THREE.Vector3(); 
// const extrudeWalls = {
//     depth: height,
//     bevelEnabled: true,
//     bevelSements: 1,
//     steps: 2,
//     bevelSize: 0,
//     bevelThickness: 0, 
//     amount: 10,  
//     material: 0, 
//     extrudeMaterial: 1,
// }    
// //=====================================================
// pos.x = 0
// pos.y = 0.2
// pos.z = 0 

// wallshape.moveTo(wallStarts_x * size, wallStarts_y * size);
// wallshape.lineTo(wallEnds_x * size, wallEnds_y * size);

// let geometry
// geometry = new THREE.ExtrudeGeometry( wallshape, extrudeWalls );

// // const material = new THREE.MeshBasicMaterial({
// //     color: color,
// //     map:  texture,  
// // });

// let material1 = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
// let material2 = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });

// let multi_materials = [
//     material2,
//     material1,
// ];


// let mesh = new THREE.Mesh(geometry, multi_materials);
// mesh.position.copy(pos);
// mesh.rotation.x = -0.5 * Math.PI;
// //console.log(mesh.geometry) 
// scene.add(mesh);

 import { Vector2 } from 'three';
import { mergeBufferGeometries  } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
 

export function createEnvironment (scene, THREE) {



    //======================clouds========================
    function createClouds(){ 
        let geo = new THREE.SphereGeometry(0,0,0);
        let count = Math.floor(Math.pow(Math.random(), 0.45) * 8);
        const colors = ["#5DA7DB","#81C6E8", "#B4CDE6"];
        let color = colors[Math.floor(Math.random()*colors.length)];

        for(let i=0; i < count; i++){
            const puff1 = new THREE.SphereGeometry(1.2, 7, 7);
            const puff2 = new THREE.SphereGeometry(1.5, 7, 7);
            const puff3 = new THREE.SphereGeometry(0.9, 7, 7); 

            puff1.translate(-1.8, Math.random() * 0.3, 0);
            puff2.translate(0, Math.random() * 0.3, 0);
            puff3.translate(1.8, Math.random() * 0.3, 0);     

            const cloudGeo = mergeBufferGeometries([puff1, puff2, puff3]);
            cloudGeo.translate(
                Math.random() * 20 - 15,
                Math.random() * 10 + 15,
                Math.random() * 20 - 15,
            );
            cloudGeo.rotateY(Math.random() * Math.PI * 2);
            geo = mergeBufferGeometries([geo, cloudGeo]);
        }
        const mesh = new THREE.Mesh(
            geo, new THREE.MeshBasicMaterial({
                color: color
            })
        );

        mesh.position.set(0, 0, -5);
        scene.add(mesh)
    }




createLand()
createClouds();

}
import * as THREE from 'three'
import { color } from 'three/examples/jsm/nodes/shadernode/ShaderNode'
import { Reflector } from 'three/examples/jsm/objects/Reflector'

const textureLoader = new THREE.TextureLoader()

export function addBoilerPlateMesh() {
	const box = new THREE.BoxGeometry(15, 1, 10)
	const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(0, 0, 0)
	return boxMesh
}

export function addStandardMesh() {
	const box = new THREE.BoxGeometry(2, 2, 2)
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(-2, 0, 0)
	return boxMesh
}



export function addLeftWindowdMesh() {
	const color=textureLoader.load("/glass/color.jpg")
    const displace=textureLoader.load("glass/displace.png")
    const normal=textureLoader.load("/glass/normal.jpg")
    const roughness=textureLoader.load("/glass/roughness.jpg")
    const ao=textureLoader.load("/glass/ambient.jpg")

	const box = new THREE.BoxGeometry(6, 4, 0.02)
	const boxMaterial = new THREE.MeshPhysicalMaterial({
        // map:color,
        // color:0xff33ee,
        // displacementMap:displace,
        // displacementScale:0.3,
        // transmission:1.0,
        // thickness:1.0,
        // metalness:0.1,
        // roughness:1.0,
        // ior:2.33,
        // normalMap:normal,
        // aoMap:ao,
        // roughnessMap:roughness
		roughness: 0,  
		transmission: 0.5,  
		thickness: 0.5, // Add refraction!
    });

	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(0.5, 3.5, -9)
	boxMesh.rotateY(Math.PI);
	// boxMesh.rotateX(Math.PI/2);
	boxMesh.rotateZ(-Math.PI/2);
	return boxMesh
}

export function addMiddleWindowdMesh() {
	const color=textureLoader.load("/glass/color.jpg")
    const displace=textureLoader.load("glass/displace.png")
    const normal=textureLoader.load("/glass/normal.jpg")
    const roughness=textureLoader.load("/glass/roughness.jpg")
    const ao=textureLoader.load("/glass/ambient.jpg")

	const box = new THREE.BoxGeometry(6, 4, 0.02)
	const boxMaterial = new THREE.MeshPhysicalMaterial({
        // map:color,
        // color:0xff33ee,
        // displacementMap:displace,
        // displacementScale:0.3,
        // transmission:1.0,
        // thickness:1.0,
        // metalness:0.1,
        // roughness:1.0,
        // ior:2.33,
        // normalMap:normal,
        // aoMap:ao,
        // roughnessMap:roughness
		roughness: 0,  
		transmission: 0.5,  
		thickness: 0.5, // Add refraction!
    });
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(-4.2, 3.5, -8)
	boxMesh.rotateY(-Math.PI/6*5);
	// boxMesh.rotateX(Math.PI/2);
	boxMesh.rotateZ(-Math.PI/2);
	return boxMesh
}


export function addRightWindowdMesh() {
	const color=textureLoader.load("/glass/color.jpg")
    const displace=textureLoader.load("glass/displace.png")
    const normal=textureLoader.load("/glass/normal.jpg")
    const roughness=textureLoader.load("/glass/roughness.jpg")
    const ao=textureLoader.load("/glass/ambient.jpg")

	const box = new THREE.BoxGeometry(6, 4, 0.02)
	const boxMaterial = new THREE.MeshPhysicalMaterial({
        // map:color,
        // color:0xff33ee,
        // displacementMap:displace,
        // displacementScale:0.3,
        // transmission:1.0,
        // thickness:1.0,
        // metalness:0.1,
        // roughness:1.0,
        // ior:2.33,
        // normalMap:normal,
        // aoMap:ao,
        // roughnessMap:roughness
		roughness: 0,  
		transmission: 0.5,  
		// thickness: 1, // Add refraction!
	  
    });
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(4.85, 3.5, -8)
	boxMesh.rotateY(Math.PI/6*5);
	// boxMesh.rotateX(Math.PI/2);
	boxMesh.rotateZ(-Math.PI/2);
	return boxMesh
}


export function addMirrorReflectorMesh(){
	const mirrorFront1 = new Reflector(new THREE.PlaneGeometry(2.8,1.9), {
		color: new THREE.Color(0x7f7f7f),
		//clipBias: 0.003,
		textureWidth: window.innerWidth * window.devicePixelRatio,
		textureHeight: window.innerHeight * window.devicePixelRatio,
	})
	mirrorFront1.position.set(7.2, 4.5,-2);
	mirrorFront1.rotateY(-Math.PI/2)
	mirrorFront1.userData.groupName = 'mirror'
	return mirrorFront1;
}

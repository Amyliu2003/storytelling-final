
import * as THREE from 'three'
import { 
	addBoilerPlateMesh, 
	addStandardMesh,
	addLeftWindowdMesh,
	addMiddleWindowdMesh,
	addRightWindowdMesh,
	addMirrorReflectorMesh
} from './addMeshes'
import { addLight,addtopLight,addAmbientLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { StaticGeometryGenerator, MeshBVHHelper } from 'three-mesh-bvh'
// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
// import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import {
	MeshBVH,
	acceleratedRaycast,
	computeBoundsTree,
	disposeBoundsTree,
} from 'three-mesh-bvh'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Reflector } from 'three/examples/jsm/objects/Reflector'
import { gsap } from 'gsap'
import { flattenJSON } from 'three/src/animation/AnimationUtils'
// import { postprocessing } from '../post-processing/postprocessing'
import Clickable from './Clickable'
import { postprocessing } from './postprocessing'
// import traverse from 'traverse'
import { tellAccount } from './start'
import { tellAnswer } from './start'


const scene = new THREE.Scene()
const premadeCanvas = document.querySelector('#three')
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: premadeCanvas })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 5)
let player = new THREE.Mesh(
	new RoundedBoxGeometry(0.5, 1, 0.5, 10, 0.5),
	new THREE.MeshStandardMaterial()
)

let playerVelocity = new THREE.Vector3()
let upVector = new THREE.Vector3(0, 1, 0)
let tempVector = new THREE.Vector3()
let tempVector2 = new THREE.Vector3()
let tempBox = new THREE.Box3()
let tempMat = new THREE.Matrix4()
let tempSegment = new THREE.Line3()
let playerIsOnGround = false
let mirroToggle=0;
let chairToggle=0;
let composer;
let lastPlayerPosition=player.position;
let lastCameraRotation=camera.rotation;
let relocate=0;


// //game

let end=true;
let doorOpen=false;
let fullAccess=false;
let rendering =true;
let isAnimating = false
let activeScene = { name: null, light: null }
let user;



export const userState = {
    username: '',
    password: '',
    access: ''
};

export function updateUserState(newUser, newPass, newAccess) {
    userState.username = newUser;
    userState.password = newPass;
    userState.access = newAccess;
}



async function checkAccount() {
    try {
        user = await tellAccount();
        if (user) {
			// console.log(user)
			if(user.username&&user.password){
				if(user.access=='author'){
					doorOpen=true;
					fullAccess=true
				
				}else if(user.access=="cat"){
					doorOpen=true;
					fullAccess=false;
				}else if(user.access=="alice"){
					doorOpen=true;
					fullAccess=false;
				}else{
					doorOpen=false;
					fullAccess=false;
				}
			}
        } 
    } catch (error) {
        console.error('Error fetching account details:', error);
    }
}

// Call the function
 



//Globals
const meshes = {}
const lights = {}
const mixers = []
const interactables = []
const clock = new THREE.Clock()
const pointer = new THREE.Vector2();
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const controls = new OrbitControls(camera, renderer.domElement)
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast
const characterParams = {
	firstPerson: true,

	displayCollider: true,
	displayBVH: true,
	visualizeDepth: 10,
	gravity: -30,
	playerSpeed: 10,
	physicsSteps: 5,

	// reset: reset,
}
const params = {
	displayCollider: true,
	displayBVH: true,
	displayParents: false,
	visualizeDepth: 10,
	gravity: -9.8,
	physicsSteps: 5,
	simulationSpeed: 1,
	sphereSize: 1,
	pause: false,
}
let environment, collider

function loadColliderEnvironment() {
	new GLTFLoader().load('alice.glb', (res) => {
		environment = res.scene
		environment.scale.setScalar(0.55)
		environment.updateMatrixWorld(true)

		const staticGenerator = new StaticGeometryGenerator(environment)
		staticGenerator.attributes = ['position']

		const mergedGeometry = staticGenerator.generate()
		mergedGeometry.boundsTree = new MeshBVH(mergedGeometry)

		collider = new THREE.Mesh(mergedGeometry)

		scene.add(environment)

		environment.traverse((c) => {
			// if (c instanceof THREE.Group) {
			// 	modelGroup = child;
			// }

			if (c.material) {
				c.castShadow = true
				c.receiveShadow = true
				c.material.shadowSide = 2
				c.frustumCulled = false;
				c.geometry.computeVertexNormals();
			}
		})
		
		modelReady = true;
	


	})
}

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)

	lights.defaultLight = addLight()
	lights.topLight= addtopLight();
	lights.ambient =addAmbientLight();
	meshes.default = addBoilerPlateMesh();
	meshes.standard = addStandardMesh();
	meshes.leftWing = addLeftWindowdMesh();
	meshes.midWing = addMiddleWindowdMesh();
	meshes.rightWing =addRightWindowdMesh();
	meshes.mirror=addMirrorReflectorMesh();




	scene.add(lights.defaultLight);
	scene.add(lights.defaultLight);
	scene.add(lights.ambient);
	// scene.add(meshes.default);
	// scene.add(meshes.standard);
	scene.add(meshes.leftWing);
	scene.add(meshes.midWing);
	scene.add(meshes.rightWing);
	scene.add(meshes.mirror);

	

	renderer.setClearColor(0xffff00);
	
	
	

	loadColliderEnvironment()
	const raycaster = new THREE.Raycaster()
	const mouse = new THREE.Vector2()
	let x = 0
	let y = 0
	renderer.domElement.addEventListener('pointerdown', (e) => {
		x = e.clientX
		y = e.clientY
	})

	renderer.domElement.addEventListener('pointerup', (e) => {
		const totalDelta = Math.abs(e.clientX - x) + Math.abs(e.clientY - y)
		if (totalDelta > 2) return

		mouse.x = (e.clientX / window.innerWidth) * 2 - 1
		mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
		raycaster.setFromCamera(mouse, camera)
	})

	models();
// 	postprocessing(scene, camera, renderer);
// 	// addInteraction()
// 	// flickerLight();
	
	raycast();
	resize();
	animate();
}

function models() {
	const door=new Model({
	 name: 'door',
	 url: 'door.glb',
	 scene: scene,
	 meshes: meshes,
	 scale: new THREE.Vector3(1.9, 1.9, 1.9),
	 position: new THREE.Vector3(-4.7, 0.2, 5.3),
	 replace: false,


	 animationState: true,
	 mixers: mixers,
	 
	})
	door.init()

	const queen=new Model({
		name: 'queen',
		url: 'queen.glb',
		scene: scene,
		meshes: meshes,
		scale: new THREE.Vector3(1, 1, 1),
		position: new THREE.Vector3(8,3,90),
		replace: false,

		animationState: true,
		mixers: mixers,
		
	   })
	   queen.init()

	const clock=new Model({
		name: 'clock',
		url: 'clock.glb',
		scene: scene,
		meshes: meshes,
		scale: new THREE.Vector3(5, 5, 5),
		position: new THREE.Vector3(-7, 2, -2),
		replace: false,
   
		animationState: true,
		mixers: mixers,
		
	   })
	   clock.rotation.y=Math.PI/2;
	   clock.castShadow=true;
	   clock.init()


	   const chair=new Model({
		name: 'chair',
		url: 'chair.glb',
		scene: scene,
		meshes: meshes,
		scale: new THREE.Vector3(0.6, 0.6, 0.6),
		position: new THREE.Vector3(-0.6,0, -5.6),
		replace: false,
   
		animationState: true,
		mixers: mixers,
		
	   })
	   chair.init()
	   chair.castShadow=true;

	   const fireplace=new Model({
		name: 'fireplace',
		url: 'fireplace.glb',
		scene: scene,
		meshes: meshes,
		scale: new THREE.Vector3(2.2,2.2,2.2),
		position: new THREE.Vector3(6.6, 1.5, -2),
		replace: false,
   
	   //  replaceURL:"/public/blackhole.png",
   
		animationState: true,
		mixers: mixers,
		
	   })
	   fireplace.rotation.y=-Math.PI/2;
	   fireplace.castShadow=true;
	   fireplace.init()


	   const mirror=new Model({
		name: 'mirror',
		url: 'mirror.glb',
		scene: scene,
		meshes: meshes,
		scale: new THREE.Vector3(0.5,0.5,0.5),
		position: new THREE.Vector3(7.3, 4.5, -2),
		replace: false,
   
   
		animationState: true,
		mixers: mixers,
		
	   })
	   mirror.castShadow=true;
	   mirror.init()

   }



let fwdPressed = false,
	bkdPressed = false,
	lftPressed = false,
	rgtPressed = false

window.addEventListener('keydown', function (e) {
	switch (e.code) {
		case 'KeyW':
			fwdPressed = true
			break
		case 'KeyS':
			bkdPressed = true
			break
		case 'KeyD':
			rgtPressed = true
			break
		case 'KeyA':
			lftPressed = true
			break
	}
})

window.addEventListener('keyup', function (e) {
	switch (e.code) {
		case 'KeyW':
			fwdPressed = false
			break
		case 'KeyS':
			bkdPressed = false
			break
		case 'KeyD':
			rgtPressed = false
			break
		case 'KeyA':
			lftPressed = false
			break
	}
})


player.geometry.translate(0, -1.0, 0)

player.capsuleInfo = {
	radius: 0.5,
	segment: new THREE.Line3(
		new THREE.Vector3(),
		new THREE.Vector3(0, -1.0, 0.0)
	),
}
player.position.set(0, 3, 0)

let para1=document.getElementById('para1').textContent;

function updatePlayer(delta) {

	if(relocate==1){
		player.position.set(0,1.617,0);
		tellInteraction('');
		relocate=0;
	}


	if (playerIsOnGround) {
		playerVelocity.y = delta * params.gravity
		if(!doorOpen){
			if(player.position.z>5){
				player.position.set(-5.6,1.6,0);
				setTimeout(() => {
					alert("The story hasn't end and it is not polite to leave.")
				  }, "500");
			}
		}

	}else{

		if(!fullAccess){
			playerVelocity.y += delta * params.gravity;
			if(player.position.y<-1){
				player.position.set(0,3,0);
	
			}
		}

	}


	player.position.addScaledVector(playerVelocity, delta)

	// move the player
	const angle = controls.getAzimuthalAngle()
	if (fwdPressed) {
		tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle)
		player.position.addScaledVector(
			tempVector,
			characterParams.playerSpeed * delta
		)
	}

	if (bkdPressed) {
		tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle)
		player.position.addScaledVector(
			tempVector,
			characterParams.playerSpeed * delta
		)
	}

	if (lftPressed) {
		tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle)
		player.position.addScaledVector(
			tempVector,
			characterParams.playerSpeed * delta
		)
	}

	if (rgtPressed) {
		tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle)
		player.position.addScaledVector(
			tempVector,
			characterParams.playerSpeed * delta
		)
	}

	player.updateMatrixWorld()
	knowPosition();

	// adjust player position based on collisions
	const capsuleInfo = player.capsuleInfo
	tempBox.makeEmpty()
	tempMat.copy(collider.matrixWorld).invert()
	tempSegment.copy(capsuleInfo.segment)

	// get the position of the capsule in the local space of the collider
	tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)
	tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)

	// get the axis aligned bounding box of the capsule
	tempBox.expandByPoint(tempSegment.start)
	tempBox.expandByPoint(tempSegment.end)

	tempBox.min.addScalar(-capsuleInfo.radius)
	tempBox.max.addScalar(capsuleInfo.radius)

	collider.geometry.boundsTree.shapecast({
		intersectsBounds: (box) => box.intersectsBox(tempBox),

		intersectsTriangle: (tri) => {
			// check if the triangle is intersecting the capsule and adjust the
			// capsule position if it is.
			const triPoint = tempVector
			const capsulePoint = tempVector2

			const distance = tri.closestPointToSegment(
				tempSegment,
				triPoint,
				capsulePoint
			)
			if (distance < capsuleInfo.radius) {
				const depth = capsuleInfo.radius - distance
				const direction = capsulePoint.sub(triPoint).normalize()

				tempSegment.start.addScaledVector(direction, depth)
				tempSegment.end.addScaledVector(direction, depth)
			}
		},
	})

	// get the adjusted position of the capsule collider in world space after checking
	// triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
	// the origin of the player model.
	const newPosition = tempVector
	newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld)

	// check how much the collider was moved
	const deltaVector = tempVector2
	deltaVector.subVectors(newPosition, player.position)

	// if the player was primarily adjusted vertically we assume it's on something we should consider ground
	playerIsOnGround = deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25)

	const offset = Math.max(0.0, deltaVector.length() - 1e-5)
	deltaVector.normalize().multiplyScalar(offset)

	// adjust the player model
	player.position.add(deltaVector)

	if (!playerIsOnGround) {
		deltaVector.normalize()
		playerVelocity.addScaledVector(
			deltaVector,
			-deltaVector.dot(playerVelocity)
		)
	} else {
		playerVelocity.set(0, 0, 0)
	}

	// adjust the camera
	camera.position.sub(controls.target)
	controls.target.copy(player.position)
	camera.position.add(player.position)
}

// window.addEventListener(('cut'),function(event){
// 	if(!end){
// 		end = true;
// 	}else{
// 		end = false;
// 	}
	
// });






let lastRaycastTime = 0;
const raycastInterval = 50; // milliseconds

function raycast(){


let lastHoveredObject = null;  
let currentHoverObject = null;

	
	window.addEventListener('mousemove', function(event) {
		checkAccount(); 
		let now = tellAnswer();
		// console.log(now)
		if(now===8){
			fullAccess=true;
			doorOpen=true;
		}


		let display=window.getComputedStyle(document.getElementById('three')).display;
// console.log('now is'+display)

		if(display=='block'){
	// console.log('now mouse can move')
	document.getElementById('three').style.pointerEvents='auto';
	document.getElementById('interaction').style.display='block'
		const currentTime = Date.now();
	
		let find=false;
		if (currentTime - lastRaycastTime > raycastInterval) {
			lastRaycastTime = currentTime;
	
			pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
			raycaster.setFromCamera(pointer, camera);
			const intersects = raycaster.intersectObjects(scene.children, true);
	
			
			
	
			intersects.forEach((intersection) => {
				let object = intersection.object;
				
				while (object) {
					if (object.userData.groupName) {
						console.log(object.userData.groupName);
	
						if(object){
							currentHoverObject=object;
						}
	
						lastHoveredObject = currentHoverObject;
	
						
						find=true;
	
	
						
						break;
	
					}
	
	
					object = object.parent;
				}
				
			});
	
			// console.log(lastHoveredObject);
			// console.log(currentHoverObject);
	
	
			if (!find) {
				if (lastHoveredObject) {
					tellInteraction('');
					console.log('back to normal!')
					lastHoveredObject.traverse((c) => {
						if (c.material&&c.material.color) {
							c.castShadow = true
							c.receiveShadow = true
							c.material.shadowSide = 2
							c.frustumCulled = false;
							c.material.color.setHex(0xffffff);
	
		
							c.geometry.computeVertexNormals();
							
							// console.log(c.material)
						}
		
					});
				}
				
			}
			
	
			if (find) {
				tellInteraction(currentHoverObject.userData.groupName);
				console.log('now hover!')
				currentHoverObject.traverse((c) => {
					// if (c instanceof THREE.Group) {
					// 	modelGroup = child;
					// }
		
					if (c.material) {
						c.castShadow = true
						c.receiveShadow = true
						c.material.shadowSide = 2
						c.frustumCulled = false;
	
						if(c.material.color){
							c.material.color.setHex(0xaaffaa);
	
						}
	
						c.geometry.computeVertexNormals();
						// console.log('this has a material1!')
						// console.log(c.material)
					}
				})
				
			}
			
	
	
	
	
			
	
	
			
		}
		
		}else{
			// console.log('freezing!')
			document.getElementById('three').style.pointerEvents='none';
		}
	
			
	});
	
	
		
	
	
	
		window.addEventListener('click',function(event){

			let display=window.getComputedStyle(document.getElementById('three')).display;
// console.log('now is'+display)

			if(display=='block'){
				// console.log('now mouse can move')
				document.getElementById('three').style.pointerEvents='auto';
			pointer.x=(event.clientX/window.innerWidth)*2-1;
			pointer.y=-(event.clientY/window.innerHeight)*2+1;
			raycaster.setFromCamera( pointer, camera );
			const intersects =raycaster.intersectObjects(scene.children,true);
	
	
	
	
	
			intersects.forEach((intersection) => {
				let object = intersection.object;
				while (object) {
					// Log and check for groupName
	
					if (object.userData.groupName === "mirror" ) {
	
						// if(mirroToggle%2==0){
							mirroToggle++;
							gsap.to(camera.rotation,{	
								x:Math.PI/4*3,
								y:-Math.PI/8*3,
								z: Math.PI/4*3,
								duration: 2,
								ease: 'power3.inOut',
								onComplete: ()=>{
									
								}
							
							});

							gsap.to(player.position,{	
								x:6,
								y:5.5,
								z:-2,
								duration: 2,
								ease: 'power3.inOut',
								onComplete:()=>{

									console.log("reading mirror");
			
									
									console.log(user)
									
									if(user){
										tellInteraction('Welcome to the Other Side '+user.username);
										
									}
									
									

									setTimeout(()=>{
										window.timeToJump=false;
										relocate++;
	
									}
									,1000)

									

									
	
									
								}	
							});
								
								
						// }else{
						// 	mirroToggle++;
						// 	gsap.to(player.position,{	
						// 		x:0,
						// 		y:3,
						// 		z:0,
						// 		duration: 2,
						// 		ease: 'power3.inOut',
						// 		onComplete:()=>{
						// 			console.log("back to the ground"); 
						// 			end = false;  
						// 			rendering=true;
								
									
									
						// 		}	
						// 	});
						// 		gsap.to(camera.rotation,{	
						// 			x:Math.PI/4*3,
						// 			y:-Math.PI/8*3,
						// 			z: Math.PI/4*3,
						// 			duration: 2,
						// 			ease: 'power3.inOut',
						// 			onComplete: ()=>{
										
						// 			}
								
						// 		});
						// }
				
						break; // Exit the while loop
					}else if (object.userData.groupName === "door" ){
						tellInteraction("please don't leave")
						console.log(doorOpen)
					}else if(object.userData.groupName === "queen" ){

						setTimeout(() => {
							alert('who is dreaming of who?');
						  }, "500");
						
					}
					
	
	
					object = object.parent; // Move up the hierarchy
				}
			});
		}else{
			console.log('freezing!')
			document.getElementById('three').style.pointerEvents='none';
		}
	
		});
}




function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function knowPosition(){
	let position= document.getElementById('position');
	let angle= document.getElementById('angle');
	position.innerHTML="position: "+player.position.x+" "+player.position.y+" "+player.position.z;
	// position.innerHTML="positionc: "+camera.position.x+" "+camera.position.y+" "+camera.position.z;
	angle.innerHTML="angle: "+camera.rotation.x/Math.PI*180+" "+camera.rotation.y/Math.PI*180+" "+camera.rotation.z/Math.PI*180;
}

function tellInteraction(content){
	let interaction= document.getElementById('interaction');
	interaction.textContent=content;
}

async function updateEnd(){
	return end;
}

// // function animate() {


function animate() {
	requestAnimationFrame(animate)
	const delta = Math.min(clock.getDelta(), 0.1)
	if (characterParams.firstPerson) {
		controls.update()
		controls.maxPolarAngle = Math.PI
		controls.minDistance = 1e-4
		controls.maxDistance = 1e-4
	}

	if (collider) {
		collider.visible = params.displayCollider
		const physicsSteps = characterParams.physicsSteps

		for (let i = 0; i < physicsSteps; i++) {
			if(rendering){
				lastPlayerPosition=player.position;
				lastCameraRotation=camera.rotation;
				updatePlayer(delta / physicsSteps)

			}
			
		}
	}

	renderer.render(scene, camera)
	// composer.composer.render()
}

if(end){
	console.log('go to the otherside')
	document.getElementById('three').style.display = 'none';
}
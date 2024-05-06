import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 3)
	return light
}


export function addtopLight() {
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(-3, 2.5, -3)
	return light
}

export function addAmbientLight() {
	const light = new THREE.AmbientLight(0xffffdd, 1)
	light.position.set(0, 1, 0)
	return light
}


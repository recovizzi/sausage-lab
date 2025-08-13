import * as THREE from 'three'

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  // A world group so we can rotate everything together around X
  const worldGroup = new THREE.Group()
  scene.add(worldGroup)

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.35)
  scene.add(ambient)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight.position.set(4, 6, 4)
  scene.add(dirLight)
  worldGroup.add(dirLight.target)
  dirLight.target.position.set(0, 0, 0)

  // Yellow ground
  const groundGeo = new THREE.PlaneGeometry(200, 200, 1, 1)
  const groundMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, roughness: 0.9, metalness: 0.0 })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  worldGroup.add(ground)

  return { scene, worldGroup, ground, dirLight }
}

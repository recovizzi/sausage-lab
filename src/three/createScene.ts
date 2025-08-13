import * as THREE from 'three'

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  const worldGroup = new THREE.Group()
  scene.add(worldGroup)

  const ambient = new THREE.AmbientLight(0xffffff, 0.22)
  scene.add(ambient)

  const hemi = new THREE.HemisphereLight(0xffffee, 0x223344, 0.35)
  scene.add(hemi)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.set(1024, 1024)
  dirLight.shadow.radius = 2
  dirLight.shadow.camera.near = 0.5
  dirLight.shadow.camera.far = 50
  dirLight.shadow.camera.left = -10
  dirLight.shadow.camera.right = 10
  dirLight.shadow.camera.top = 10
  dirLight.shadow.camera.bottom = -10
  scene.add(dirLight)
  scene.add(dirLight.target)

  const groundGeo = new THREE.PlaneGeometry(200, 200)
  const groundMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.2 })

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#f5f5f5'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = 'rgba(200,200,200,0.4)'
  ctx.lineWidth = 8
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.bezierCurveTo(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * canvas.width,
      Math.random() * canvas.height,
    )
    ctx.stroke()
  }
  const marbleTex = new THREE.CanvasTexture(canvas)
  marbleTex.wrapS = marbleTex.wrapT = THREE.RepeatWrapping
  marbleTex.repeat.set(4, 4)
  groundMat.map = marbleTex

  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  worldGroup.add(ground)

  return { scene, worldGroup, ground, dirLight, ambient, hemi }
}

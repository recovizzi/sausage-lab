import * as THREE from 'three'

export function createSausage() {
  // Geometry: capsule approximates a cartoon sausage nicely
  const radius = 0.35
  const length = 2.2
  const capSegments = 16
  // @ts-ignore CapsuleGeometry available in recent three versions
  const geometry = new THREE.CapsuleGeometry(radius, length, capSegments, capSegments)

  // Toon material — simple flatish shading
  const material = new THREE.MeshToonMaterial({
    color: new THREE.Color('#C46A4A'),
  })

  const mesh = new THREE.Mesh(geometry, material)
  // Start horizontally aligned (X axis lengthwise)
  mesh.rotation.z = Math.PI / 2

  return mesh
}

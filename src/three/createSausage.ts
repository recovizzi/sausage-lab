import * as THREE from 'three'

export function createSausage() {
  const group = new THREE.Group()

  const bodyRadius = 0.35
  const bodyLength = 2.2
  const seg = 24

  // Capsule body
  // @ts-expect-error CapsuleGeometry lacks type in current Three.js typings
  const bodyGeo = new THREE.CapsuleGeometry(bodyRadius, bodyLength, seg, seg)
  const bodyMat = new THREE.MeshToonMaterial({ color: new THREE.Color('#C46A4A') })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.rotation.z = Math.PI / 2
  body.castShadow = true
  group.add(body)

  // Tip (one end) hemisphere + small torus tie
  const tipColor = new THREE.Color('#AF5D44')
  const tipGeo = new THREE.SphereGeometry(bodyRadius * 0.95, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2)
  const tipMat = new THREE.MeshToonMaterial({ color: tipColor })
  const tip = new THREE.Mesh(tipGeo, tipMat)
  tip.rotation.z = Math.PI / 2
  tip.position.set(bodyLength / 2 + bodyRadius * 0.02, 0, 0)
  tip.castShadow = true
  group.add(tip)

  const tieGeo = new THREE.TorusGeometry(bodyRadius * 0.5, bodyRadius * 0.08, 12, 24)
  const tieMat = new THREE.MeshToonMaterial({ color: tipColor })
  const tie = new THREE.Mesh(tieGeo, tieMat)
  tie.rotation.y = Math.PI / 2
  tie.position.set(bodyLength / 2 - bodyRadius * 0.15, 0, 0)
  tie.castShadow = true
  group.add(tie)

  return group
}

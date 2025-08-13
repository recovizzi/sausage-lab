import * as THREE from 'three'

export function createSausage() {
  const group = new THREE.Group()

  const bodyRadius = 0.35
  const bodyLength = 2.2
  const seg = 24
  const bodyMat = new THREE.MeshToonMaterial({ color: new THREE.Color('#C46A4A') })

  // Left half
  const leftSegment = new THREE.Group()
  const leftCylGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyLength / 2, seg, 1, true)
  const leftCyl = new THREE.Mesh(leftCylGeo, bodyMat)
  leftCyl.rotation.z = Math.PI / 2
  leftCyl.castShadow = true
  leftSegment.add(leftCyl)
  const leftCapGeo = new THREE.SphereGeometry(bodyRadius, seg, seg)
  const leftCap = new THREE.Mesh(leftCapGeo, bodyMat)
  leftCap.rotation.z = Math.PI / 2
  leftCap.position.set(-bodyLength / 4 - bodyRadius, 0, 0)
  leftCap.castShadow = true
  leftSegment.add(leftCap)
  leftSegment.position.x = -bodyLength / 4

  // Right half
  const rightSegment = new THREE.Group()
  const rightCylGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyLength / 2, seg, 1, true)
  const rightCyl = new THREE.Mesh(rightCylGeo, bodyMat)
  rightCyl.rotation.z = Math.PI / 2
  rightCyl.castShadow = true
  rightSegment.add(rightCyl)
  const rightCapGeo = new THREE.SphereGeometry(bodyRadius, seg, seg)
  const rightCap = new THREE.Mesh(rightCapGeo, bodyMat)
  rightCap.rotation.z = Math.PI / 2
  rightCap.position.set(bodyLength / 4 + bodyRadius, 0, 0)
  rightCap.castShadow = true
  rightSegment.add(rightCap)
  rightSegment.position.x = bodyLength / 4

  // Tip and tie attached to right half
  const tipColor = new THREE.Color('#AF5D44')
  const tipGeo = new THREE.SphereGeometry(bodyRadius * 0.95, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2)
  const tipMat = new THREE.MeshToonMaterial({ color: tipColor })
  const tip = new THREE.Mesh(tipGeo, tipMat)
  tip.rotation.z = Math.PI / 2
  tip.position.set(bodyLength / 4 + bodyRadius + bodyRadius * 0.02, 0, 0)
  tip.castShadow = true
  rightSegment.add(tip)

  const tieGeo = new THREE.TorusGeometry(bodyRadius * 0.5, bodyRadius * 0.08, 12, 24)
  const tieMat = new THREE.MeshToonMaterial({ color: tipColor })
  const tie = new THREE.Mesh(tieGeo, tieMat)
  tie.rotation.y = Math.PI / 2
  tie.position.set(bodyLength / 4 + bodyRadius - bodyRadius * 0.15, 0, 0)
  tie.castShadow = true
  rightSegment.add(tie)

  group.add(leftSegment)
  group.add(rightSegment)

  return { group, leftSegment, rightSegment }
}


import * as THREE from 'three'

export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })
  const dpr = Math.min(window.devicePixelRatio ?? 1, 1.75)
  renderer.setPixelRatio(dpr)
  return renderer
}

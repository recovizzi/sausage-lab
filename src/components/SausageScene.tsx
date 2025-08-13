import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createRenderer } from '@/three/createRenderer'
import { createScene } from '@/three/createScene'
import { createSausage } from '@/three/createSausage'
import { setupInputDragX } from '@/three/inputDragX'

export default function SausageScene() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Sizes
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Renderer
    const renderer = createRenderer()
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // Scene & Camera
    const { scene, worldGroup, ground, dirLight } = createScene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200)
    camera.position.set(0, 3, 6)
    camera.lookAt(0, 0.5, 0)

    // Sausage
    const sausage = createSausage()
    sausage.position.set(0, 1, 0)
    worldGroup.add(sausage)

    // Shadow setup
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    dirLight.castShadow = true
    ground.receiveShadow = true
    sausage.castShadow = true

    // Drag X control on the group
    const cleanupDrag = setupInputDragX(container, worldGroup)

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    // Animation loop
    const clock = new THREE.Clock()
    const baseY = 1
    const amplitude = 0.45
    const speed = 1.6

    let raf = 0
    const tick = () => {
      const t = clock.getElapsedTime()
      // Bouncy motion (sin)
      const y = baseY + Math.abs(Math.sin(t * speed)) * amplitude
      sausage.position.y = y

      // Simple squash & stretch based on vertical velocity approx
      const vel = Math.cos(t * speed) * speed
      const squash = THREE.MathUtils.clamp(1 - Math.abs(vel) * 0.08, 0.88, 1.06)
      sausage.scale.set(1 / squash, squash, 1 / squash)

      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      cleanupDrag()
      ro.disconnect()
      renderer.dispose()
      // Dispose geometries/materials
      ground.geometry.dispose()
      ;(ground.material as THREE.Material).dispose()
      sausage.geometry.dispose()
      ;(sausage.material as THREE.Material).dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="h-full w-full overflow-hidden rounded-xl" />
}

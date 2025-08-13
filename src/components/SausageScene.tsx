import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createRenderer } from '@/three/createRenderer'
import { createScene } from '@/three/createScene'
import { createSausage } from '@/three/createSausage'
import { setupInputDragX } from '@/three/inputDragX'
import kitchenURL from '@/assets/kitchen-blur.jpg'

type Props = {
  paused: boolean
  timeScale: number
  bounceBoost: number
  sunAzimuth: number
  sunElevation: number
}

export default function SausageScene({ paused, timeScale, bounceBoost, sunAzimuth, sunElevation }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const renderer = createRenderer()
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const { scene, worldGroup, ground, dirLight } = createScene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 400)
    camera.position.set(0, 3, 7)
    camera.lookAt(0, 1, 0)

    // Background image plane
    const texLoader = new THREE.TextureLoader()
    const bgTex = texLoader.load(kitchenURL)
    bgTex.colorSpace = THREE.SRGBColorSpace
    const bgGeo = new THREE.PlaneGeometry(200, 120)
    const bgMat = new THREE.MeshBasicMaterial({ map: bgTex })
    const bg = new THREE.Mesh(bgGeo, bgMat)
    bg.position.set(0, 25, -60)
    scene.add(bg)

    const sausage = createSausage()
    sausage.position.set(0, 1.0, 0)
    sausage.castShadow = true
    worldGroup.add(sausage)

    ground.receiveShadow = true

    const cleanupDrag = setupInputDragX(container, worldGroup, true)

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    // physics
    const radius = 0.35
    let y = 1.0
    let vy = bounceBoost
    const g = -9.8
    const restitution = 0.72

    const clock = new THREE.Clock()
    let raf = 0

    function updateSunFromAngles(azDeg: number, elDeg: number) {
      const az = THREE.MathUtils.degToRad(azDeg)
      const el = THREE.MathUtils.degToRad(elDeg)
      const r = 10
      const x = Math.cos(el) * Math.cos(az) * r
      const y = Math.sin(el) * r
      const z = Math.cos(el) * Math.sin(az) * r
      dirLight.position.set(x, y, z)
      dirLight.target.position.set(0, 0, 0)
      dirLight.target.updateMatrixWorld()
    }
    updateSunFromAngles(sunAzimuth, sunElevation)

    const tick = () => {
      const dt = Math.min(clock.getDelta() * timeScale, 0.05)
      if (!paused) {
        vy += g * dt
        y += vy * dt

        const floorY = 0 + radius * 0.98
        if (y < floorY) {
          y = floorY
          vy = Math.abs(vy) * restitution
        }

        sausage.position.y = y

        const compression = Math.max(0, (floorY + 0.02) - y) * 6
        const vel = Math.abs(vy)
        const squash = THREE.MathUtils.clamp(1 - compression - vel * 0.01, 0.82, 1.08)
        sausage.scale.set(1 / squash, squash, 1 / squash)
      }

      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      cleanupDrag()
      ro.disconnect()
      renderer.dispose()

      ground.geometry.dispose()
      ;(ground.material as THREE.Material).dispose()

      sausage.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh
          m.geometry?.dispose?.()
          ;(m.material as THREE.Material)?.dispose?.()
        }
      })

      bgGeo.dispose()
      bgMat.dispose()
      bgTex.dispose()

      container.removeChild(renderer.domElement)
    }
  }, [paused, timeScale, bounceBoost, sunAzimuth, sunElevation])

  return <div ref={containerRef} className="h-full w-full" />
}

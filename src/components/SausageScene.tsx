import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createRenderer } from '@/three/createRenderer'
import { createScene } from '@/three/createScene'
import { createSausage } from '@/three/createSausage'
import kitchenURL from '@/assets/kitchen-blur.jpg'

type Props = {
  paused: boolean
  timeScale: number
  bounceBoost: number
  sunAzimuth: number
  sunElevation: number
  cameraAzimuth: number
  cameraElevation: number
}

export default function SausageScene({ paused, timeScale, bounceBoost, sunAzimuth, sunElevation, cameraAzimuth, cameraElevation }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const camAzRef = useRef(cameraAzimuth)
  const camElRef = useRef(cameraElevation)

  useEffect(() => { camAzRef.current = cameraAzimuth }, [cameraAzimuth])
  useEffect(() => { camElRef.current = cameraElevation }, [cameraElevation])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let width = container.clientWidth
    let height = container.clientHeight

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

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    // physics
    const radius = 0.35
    let x = 0
    let y = 1.0
    let vx = 0
    let vy = bounceBoost
    const G = -9.8
    const RESTITUTION = 0.72
    const DAMPING_X = 0.995
    const EPS_VY = 0.02
    const EPS_VX = 0.02
    const EPS_POS = 0.005
    const IMPULSE = 2.5
    let animating = true

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    function onPointerDown(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObject(sausage, true)
      if (hits.length) {
        const hitX = hits[0].point.x
        const dir = hitX < sausage.position.x ? -1 : 1
        vx = dir * IMPULSE
        animating = true
      }
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown)

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
      if (!paused && animating) {
        vx *= DAMPING_X
        vy += G * dt
        x += vx * dt
        y += vy * dt

        const floorY = 0 + radius * 0.98
        if (y < floorY) {
          y = floorY
          vy = -vy * RESTITUTION
        }

        sausage.position.set(x, y, 0)

        const compression = Math.max(0, (floorY + 0.02) - y) * 6
        const vel = Math.abs(vy)
        const squash = THREE.MathUtils.clamp(1 - compression - vel * 0.01, 0.82, 1.08)
        sausage.scale.set(1 / squash, squash, 1 / squash)

        if (Math.abs(vy) < EPS_VY && Math.abs(y - floorY) < EPS_POS && Math.abs(vx) < EPS_VX) {
          vy = 0
          vx = 0
          y = floorY
          animating = false
        }
      }

      const az = THREE.MathUtils.degToRad(camAzRef.current)
      const el = THREE.MathUtils.clamp(THREE.MathUtils.degToRad(camElRef.current), 0.087, Math.PI - 0.087)
      const r = 6
      camera.position.set(
        r * Math.sin(el) * Math.cos(az),
        r * Math.cos(el),
        r * Math.sin(el) * Math.sin(az),
      )
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
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

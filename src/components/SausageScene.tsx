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
  cameraRadius: number
}

export default function SausageScene({ paused, timeScale, bounceBoost, sunAzimuth, sunElevation, cameraAzimuth, cameraElevation, cameraRadius }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const camAzRef = useRef(cameraAzimuth)
  const camElRef = useRef(cameraElevation)
  const camRadRef = useRef(cameraRadius)

  useEffect(() => { camAzRef.current = cameraAzimuth }, [cameraAzimuth])
  useEffect(() => { camElRef.current = cameraElevation }, [cameraElevation])
  useEffect(() => { camRadRef.current = cameraRadius }, [cameraRadius])

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

    const { group: sausage, leftSegment, rightSegment } = createSausage()
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
    const bodyLen = 2.2
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
    let animating = true

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let dragging = false
    let dragAxis: 'x' | 'y' | null = null
    const prevPoint = new THREE.Vector3()
    let prevTime = 0
    let bend = 0
    let bendVel = 0

    function onPointerDown(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObject(sausage, true)
      if (hits.length) {
        const local = sausage.worldToLocal(hits[0].point.clone())
        dragAxis = Math.abs(local.x) > bodyLen * 0.25 ? 'y' : 'x'
        dragging = true
        prevPoint.copy(hits[0].point)
        prevTime = performance.now()
        animating = true
        renderer.domElement.addEventListener('pointermove', onPointerMove)
        renderer.domElement.addEventListener('pointerup', onPointerUp)
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging) return
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const plane = dragAxis === 'y'
        ? new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
        : new THREE.Plane(new THREE.Vector3(0, 1, 0), -y)
      const pt = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, pt)
      const now = performance.now()
      const dt = Math.max((now - prevTime) / 1000, 0.001)
      if (dragAxis === 'y') {
        vy = (pt.y - prevPoint.y) / dt
        y = Math.max(pt.y, radius)
      } else if (dragAxis === 'x') {
        vx = (pt.x - prevPoint.x) / dt
        x = pt.x
      }
      prevPoint.copy(pt)
      prevTime = now
    }

    function onPointerUp() {
      dragging = false
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
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

        const targetBend = THREE.MathUtils.clamp(vx * 0.05, -0.4, 0.4)
        bendVel += (targetBend - bend) * 0.1
        bendVel *= 0.92
        bend += bendVel
        leftSegment.rotation.z = bend
        rightSegment.rotation.z = -bend

        if (Math.abs(vy) < EPS_VY && Math.abs(y - floorY) < EPS_POS && Math.abs(vx) < EPS_VX) {
          vy = 0
          vx = 0
          y = floorY
          animating = false
        }
      }

      const az = THREE.MathUtils.degToRad(camAzRef.current)
      const el = THREE.MathUtils.clamp(THREE.MathUtils.degToRad(camElRef.current), 0.087, Math.PI - 0.087)
      const r = THREE.MathUtils.clamp(camRadRef.current, 4, 20)
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

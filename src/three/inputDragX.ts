import * as THREE from 'three'

export function setupInputDragX(container: HTMLElement, target: THREE.Object3D, horizontal = true) {
  let dragging = false
  let lastX = 0
  let velocity = 0
  let frame = 0

  const sensibility = 0.006
  const friction = 0.92

  const onPointerDown = (e: PointerEvent) => {
    dragging = true
    lastX = e.clientX
    (e.target as Element).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - lastX
    lastX = e.clientX
    const delta = (horizontal ? dx : 0) * sensibility
    target.rotation.x = THREE.MathUtils.clamp(target.rotation.x + delta, -Math.PI / 2, Math.PI / 2)
    velocity = delta
  }

  const onPointerUp = (e: PointerEvent) => {
    dragging = false
    ;(e.target as Element).releasePointerCapture(e.pointerId)
  }

  const animateInertia = () => {
    if (!dragging) {
      velocity *= 0.92
      if (Math.abs(velocity) > 0.0001) {
        target.rotation.x = THREE.MathUtils.clamp(target.rotation.x + velocity, -Math.PI / 2, Math.PI / 2)
      }
    }
    frame = requestAnimationFrame(animateInertia)
  }
  frame = requestAnimationFrame(animateInertia)

  container.addEventListener('pointerdown', onPointerDown)
  container.addEventListener('pointermove', onPointerMove)
  container.addEventListener('pointerup', onPointerUp)
  container.addEventListener('pointerleave', onPointerUp)

  return () => {
    cancelAnimationFrame(frame)
    container.removeEventListener('pointerdown', onPointerDown)
    container.removeEventListener('pointermove', onPointerMove)
    container.removeEventListener('pointerup', onPointerUp)
    container.removeEventListener('pointerleave', onPointerUp)
  }
}

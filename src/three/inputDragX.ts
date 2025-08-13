import * as THREE from 'three'

export function setupInputDragX(container: HTMLElement, target: THREE.Object3D) {
  let dragging = false
  let lastY = 0
  let velocity = 0
  let frame = 0

  const sensibility = 0.006
  const friction = 0.92

  const onPointerDown = (e: PointerEvent) => {
    dragging = true
    lastY = e.clientY
    (e.target as Element).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return
    const dy = e.clientY - lastY
    lastY = e.clientY
    const delta = dy * sensibility
    target.rotation.x = THREE.MathUtils.clamp(target.rotation.x + delta, -Math.PI / 2, Math.PI / 2)
    velocity = delta
  }

  const onPointerUp = (e: PointerEvent) => {
    dragging = false
    ;(e.target as Element).releasePointerCapture(e.pointerId)
  }

  const animateInertia = () => {
    if (!dragging) {
      velocity *= friction
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

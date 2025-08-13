import { useState } from 'react'
import SausageScene from './components/SausageScene'
import ControlsOverlay from './components/ControlsOverlay'

export default function App() {
  const [paused, setPaused] = useState(false)
  const [timeScale, setTimeScale] = useState(1)
  const [bounceBoost, setBounceBoost] = useState(5)
  const [sunAzimuth, setSunAzimuth] = useState(35)
  const [sunElevation, setSunElevation] = useState(40)
  const [camAzimuth, setCamAzimuth] = useState(30)
  const [camElevation, setCamElevation] = useState(30)
  const [camRadius, setCamRadius] = useState(6)

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <SausageScene
        paused={paused}
        timeScale={timeScale}
        bounceBoost={bounceBoost}
        sunAzimuth={sunAzimuth}
        sunElevation={sunElevation}
        cameraAzimuth={camAzimuth}
        cameraElevation={camElevation}
        cameraRadius={camRadius}
      />
      <ControlsOverlay
        paused={paused}
        onTogglePause={() => setPaused(p => !p)}
        timeScale={timeScale}
        setTimeScale={setTimeScale}
        bounceBoost={bounceBoost}
        setBounceBoost={setBounceBoost}
        sunAzimuth={sunAzimuth}
        setSunAzimuth={setSunAzimuth}
        sunElevation={sunElevation}
        setSunElevation={setSunElevation}
        cameraAzimuth={camAzimuth}
        setCameraAzimuth={setCamAzimuth}
        cameraElevation={camElevation}
        setCameraElevation={setCamElevation}
        cameraRadius={camRadius}
        setCameraRadius={setCamRadius}
      />
      <div className="pointer-events-none fixed top-2 right-2 text-xl font-bold opacity-30 select-none">
        Saucisse Labs
      </div>
    </div>
  )
}

import { useState } from 'react'
import SausageScene from './components/SausageScene'
import ControlsOverlay from './components/ControlsOverlay'

export default function App() {
  const [paused, setPaused] = useState(false)
  const [timeScale, setTimeScale] = useState(1)
  const [bounceBoost, setBounceBoost] = useState(5)
  const [sunAzimuth, setSunAzimuth] = useState(35)
  const [sunElevation, setSunElevation] = useState(40)

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <SausageScene
        paused={paused}
        timeScale={timeScale}
        bounceBoost={bounceBoost}
        sunAzimuth={sunAzimuth}
        sunElevation={sunElevation}
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
      />
    </div>
  )
}

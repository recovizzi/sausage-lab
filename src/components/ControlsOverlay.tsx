type Props = {
  paused: boolean
  onTogglePause: () => void
  timeScale: number
  setTimeScale: (v: number) => void
  bounceBoost: number
  setBounceBoost: (v: number) => void
  sunAzimuth: number
  setSunAzimuth: (v: number) => void
  sunElevation: number
  setSunElevation: (v: number) => void
  cameraAzimuth: number
  setCameraAzimuth: (v: number) => void
  cameraElevation: number
  setCameraElevation: (v: number) => void
}

export default function ControlsOverlay(props: Props) {
  return (
    <div className="overlay-panel p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="overlay-title">Sausage Lab • Controls</div>
        <button className="btn btn-sm" onClick={props.onTogglePause}>
          {props.paused ? 'Play' : 'Pause'}
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <div className="text-xs opacity-70 mb-1">Speed (time scale): {props.timeScale.toFixed(2)}×</div>
          <input type="range" min={0.2} max={2.5} step={0.1} value={props.timeScale}
            onChange={(e) => props.setTimeScale(parseFloat(e.currentTarget.value))}
            className="range range-xs" />
        </div>

      <div>
        <div className="text-xs opacity-70 mb-1">Bounce boost (initial velocity): {props.bounceBoost.toFixed(1)}</div>
        <input type="range" min={2} max={10} step={0.5} value={props.bounceBoost}
          onChange={(e) => props.setBounceBoost(parseFloat(e.currentTarget.value))}
          className="range range-xs" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs opacity-70 mb-1">Camera azimuth: {props.cameraAzimuth.toFixed(0)}°</div>
          <input type="range" min={0} max={360} step={1} value={props.cameraAzimuth}
            onChange={(e) => props.setCameraAzimuth(parseFloat(e.currentTarget.value))}
            className="range range-xs" />
        </div>
        <div>
          <div className="text-xs opacity-70 mb-1">Camera elevation: {props.cameraElevation.toFixed(0)}°</div>
          <input type="range" min={0} max={180} step={1} value={props.cameraElevation}
            onChange={(e) => props.setCameraElevation(parseFloat(e.currentTarget.value))}
            className="range range-xs" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs opacity-70 mb-1">Sun azimuth: {props.sunAzimuth.toFixed(0)}°</div>
          <input type="range" min={-180} max={180} step={1} value={props.sunAzimuth}
            onChange={(e) => props.setSunAzimuth(parseFloat(e.currentTarget.value))}
              className="range range-xs" />
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Sun elevation: {props.sunElevation.toFixed(0)}°</div>
            <input type="range" min={5} max={85} step={1} value={props.sunElevation}
              onChange={(e) => props.setSunElevation(parseFloat(e.currentTarget.value))}
              className="range range-xs" />
          </div>
        </div>
      </div>
    </div>
  )
}

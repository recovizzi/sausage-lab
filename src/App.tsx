import { useState } from 'react'
import Navbar from '@/components/Navbar'
import SausageScene from '@/components/SausageScene'

export default function App() {
  const [mounted, setMounted] = useState(true)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-6 md:grid-cols-5">
            <section className="md:col-span-3">
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h2 className="card-title">Sausage Lab — Three.js Playground</h2>
                  <p className="opacity-80">
                    Minimal Three.js scene with a yellow ground and a bouncing toon sausage.
                    Drag vertically to rotate the scene around the X axis.
                  </p>
                  <div className="mt-4 h-[420px] rounded-xl border border-base-300">
                    <SausageScene />
                  </div>
                </div>
              </div>
            </section>
            <aside className="md:col-span-2">
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title">Quick checks</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Tailwind v4 utilities (spacing, flex) working</li>
                    <li>daisyUI v5 components (cards, buttons) working</li>
                    <li>Three.js renderer attached and animating</li>
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => setMounted((m) => !m)}>
                      {mounted ? 'Unmount Scene' : 'Mount Scene'}
                    </button>
                    <a className="btn btn-outline btn-sm" href="https://threejs.org/" target="_blank" rel="noreferrer">
                      Three.js Docs
                    </a>
                  </div>
                  {!mounted && (
                    <p className="mt-2 text-xs opacity-70">
                      Scene unmounted — use this to validate cleanup of listeners and GPU resources.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <footer className="border-t border-base-300 py-4 text-center text-sm opacity-70">
        © {new Date().getFullYear()} Sausage Lab
      </footer>
    </div>
  )
}

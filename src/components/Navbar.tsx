import { useEffect, useState } from 'react'

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="navbar bg-base-100 shadow">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex items-center justify-between">
          <a className="text-lg font-bold tracking-wide">🌭 Sausage Lab</a>
          <div className="flex items-center gap-3">
            <button
              className="btn btn-sm"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            >
              {theme === 'light' ? 'Dark' : 'Light'} mode
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

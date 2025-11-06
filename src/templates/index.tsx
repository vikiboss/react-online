import React from 'react'
import dayjs from 'dayjs'
import { useMouse, useNow } from '@shined/react-use'

export function App() {
  return (
    <div>
      <Introduction />
    </div>
  )
}

function Introduction() {
  const { x, y } = useMouse()
  const now = useNow()
  const nowStr = dayjs(now).format('YYYY-MM-DD HH:mm:ss:SSS')

  return (
    <div className="p-8 text-gray font-medium">
      <h1 className="text-amber text-4xl mt-8 mb-2">Hello, React ⚛️</h1>
      <p>React Online is a online React playground with native ESM & UnoCSS/TailwindCSS support.</p>
      <h2 className="text-zinc-400/80 text-2xl mt-8 mb-2">Getting Started</h2>
      <p>
        Start by clearing the <span className="text-lime">{'<Introduction />'}</span> and start typing your code.
      </p>
      <p>
        You can also use <span className="text-lime">import map</span> to import npm packages.
      </p>
      <hr className="my-8" />
      <h2 className="text-zinc-400/80 text-2xl mt-8 mb-2">React Version</h2>
      <p>
        <span className="text-lime">{React.version}</span>, you can use <span className="text-lime">canary</span>{' '}
        version by editing <span className="text-lime">Import Map</span>.
      </p>
      <h2 className="text-zinc-400/80 text-2xl mt-8 mb-2">npm package support</h2>
      <p>
        Time formatted from <span className="text-lime">dayjs</span> is: {nowStr}
      </p>
      <h2 className="text-zinc-400/80 text-2xl mt-8 mb-2">React Hooks support</h2>
      <p>
        Position returned by <span className="text-lime">useMouse</span> is: ({x}, {y})
      </p>
      <h2 className="text-zinc-400/80 text-2xl mt-8 mb-2">UnoCSS/TailwindCSS Support</h2>
      <p>
        UnCSS is a pleasant instant CSS engine, <span className="text-lime">enabled</span> by default.
      </p>
    </div>
  )
}

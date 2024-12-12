import React from 'react';
import dayjs from 'dayjs'
import { useMouse, useNow } from '@shined/react-use'

export function App() {
  const { x, y } = useMouse()
  const now = useNow();
  const nowStr = dayjs(now).format('YYYY-MM-DD HH:mm:ss:SSS')

  return (
    <div className='p-8 text-gray font-medium'>
      <h1 className='text-amber text-4xl mt-8 mb-2'>Hello, React ⚛️ <sup>v{React.version}</sup></h1>
      <p>React Online is a Online React Playground with Native ESM、Arbitrary Npm Package (Powered by esm.sh), Hooks and UnoCSS Support.</p>
      <h2 className='text-white text-2xl mt-8 mb-2'>Npm Package Support</h2>
      <p>Time formatted from <span className='text-lime'>dayjs</span> is: {nowStr}</p>
      <h2 className='text-white text-2xl mt-8 mb-2'>Hooks Support</h2>
      <p>Position returned by <span className='text-lime'>useMouse</span> is: ({x}, {y})</p>
      <h2 className='text-white text-2xl mt-8 mb-2'>UnoCSS Support</h2>
      <p>UnCSS is a pleasant instant CSS engine, <span className='text-lime'>enabled</span> by default.</p>
    </div>
  )
}



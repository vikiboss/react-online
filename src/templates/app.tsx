import { create } from '@shined/reactive'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

const store = create({ count: 1, time: Date.now() })
const addOne = () => store.mutate.count++
const updateTime = () => (store.mutate.time = Date.now())

function App() {
  const [count, time] = store.useSnapshot((s) => [s.count, s.time])

  useEffect(() => {
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatted = dayjs(time).format('YYYY/MM/DD HH:mm:ss')

  return (
    <div>
      <div>Time: {formatted}</div>
      <button onClick={addOne}>Count: {count}</button>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

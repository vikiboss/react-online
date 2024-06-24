import { create } from '@shined/reactive'
import { createRoot } from 'react-dom/client'
import { useMouse, useDateFormat } from '@shined/react-use'

const store = create({ count: 1, time: Date.now() })
const addOne = () => store.mutate.count++
const updateTime = () => (store.mutate.time = Date.now())

setInterval(updateTime, 1000)

function App() {
  const { x, y } = useMouse()
  const [count, time] = store.useSnapshot(s => [s.count, s.time])
  const formatted = useDateFormat(time, 'YYYY/MM/DD HH:mm:ss')

  return (
    <div>
      <div>(x, y): ({x}, {y})</div>
      <div>Time: {formatted}</div>
      <button onClick={addOne}>Count: {count}</button>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

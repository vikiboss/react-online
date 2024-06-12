import dayjs from 'dayjs'
import { create } from '@shined/reactive'
import { createRoot } from 'react-dom/client'

const store = create({ count: 1 })
const addOne = () => store.mutate.count++

function App() {
  const count = store.useSnapshot(s => s.count)
  const date = dayjs().format('YYYY/MM/DD HH:mm:ss:SSS')

  return (
    <button onClick={addOne}>
      {date} --- {count}
    </button>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

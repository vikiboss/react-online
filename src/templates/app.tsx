import { create } from '@shined/reactive'
import { createRoot } from 'react-dom/client'

const store = create({ count: 1 })
const addOne = () => store.mutate.count++

function App() {
  const count = store.useSnapshot(s => s.count)
  return <button onClick={addOne}>{count}</button>
}

createRoot(document.getElementById('root')!).render(<App />)

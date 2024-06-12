// @ts-expect-error template
import { Button } from 'shineout'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const [count, setCount] = useState(0)

  return <Button onClick={() => setCount(c => c + 1)}>{count}</Button>
}

createRoot(document.getElementById('root')!).render(<App />)

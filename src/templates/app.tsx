import dayjs from 'dayjs'
import { createRoot } from 'react-dom/client'

function App() {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return (
    <div className='p-4'>
      <h3 className='text-amber-5 text-2xl font-medium'>Hello World!</h3>
      <p>You can import any npm package. Just use it!!</p>
      <p className='text-gray'>`dayjs` example: now is {now}</p>
      <p className='text-gray'>PS: UnoCSS is enabled by default.</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

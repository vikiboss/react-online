import { createRoot } from 'react-dom/client'

function App() {
  return (
    <div className='p-4'>
      <h3 className='text-amber-5 text-2xl font-medium'>Hello World!</h3>
      <p>UnoCSS is enabled by default. Just use it!</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

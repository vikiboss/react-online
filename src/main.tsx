import React from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import './styles/tokens.css'

import { App } from './app.tsx'

const mainDiv = document.getElementById('main')

if (mainDiv) {
  const root = createRoot(mainDiv)

  root.render(
    <React.StrictMode>
      <App />
      <Toaster />
    </React.StrictMode>,
  )
} else {
  console.error('mainDiv is null')
}

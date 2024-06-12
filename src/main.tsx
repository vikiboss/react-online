import React from 'react'
import { Toaster } from 'react-hot-toast'
import { createRoot } from 'react-dom/client'

import '@unocss/reset/normalize.css'
import 'virtual:uno.css'

import { App } from './app.tsx'

const mainDiv = document.getElementById('main')

if (mainDiv) {
  const root = createRoot(mainDiv)

  root.render(
    <React.StrictMode>
      <App />
      <Toaster />
    </React.StrictMode>
  )
} else {
  console.error('mainDiv is null')
}

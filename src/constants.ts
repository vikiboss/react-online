export const defaultCode = `
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}

createRoot(document.getElementById("root")!).render(<App />)
`.trim()

export const defaultImportMap = {
  react: 'https://esm.sh/react',
  'react/jsx-dev-runtime': 'https://esm.sh/react/jsx-dev-runtime',
  'react-dom/client': 'https://esm.sh/react-dom/client',
}

export function getHTML(script: string, importMap: string) {
  return `
<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>React Playground</title>
      <script type="importmap">{"imports": ${importMap}}</script>
    </head>
    <body>
      <div id="root"></div>
      <script type="module">${script}</script>
    </body>
  </html>
`.trim()
}

import { transform } from 'sucrase'
import { useMemo } from 'react'
import { globalStore } from '@/store'

import type { DependencyList } from 'react'

export function useIframeUrl(code = '', importMap = '', deps: DependencyList = []) {
  return useMemo(() => {
    let html = ''

    try {
      const output = transform(code, {
        transforms: ['typescript', 'jsx'],
        jsxRuntime: 'automatic',
        production: true,
        filePath: 'index.js',
        sourceMapOptions: {
          compiledFilename: 'index.min.js',
        },
      })

      html = getIframeContent(output.code, importMap)
    } catch (e) {
      html = `
    <style>
      :root {
        color-scheme: light dark;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
          Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }

      body {
        margin: 0;
        background-color: Canvas;
        color: CanvasText;
      }
    </style>
    <h3>Error ocurred! Check your code</h3>
    <pre>${e}</pre>
`
    }

    return URL.createObjectURL(new Blob([html], { type: 'text/html' }))
  }, [code, importMap, ...deps])
}

export function getIframeContent(script: string, importMap: string) {
  const raw = globalStore.mutate.html.replace('<!-- IMPORT_MAP -->', importMap).replace('/** SCRIPT */', script)

  if (globalStore.mutate.useWaterCSS) {
    return raw
  }

  return raw
    .split('\n')
    .filter((line) => !line.includes('water.css'))
    .join('\n')
}

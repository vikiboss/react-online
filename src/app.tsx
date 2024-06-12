import { transform } from 'sucrase'
import { useState, useEffect, useRef } from 'react'

import appCode from './templates/app?raw'
import { MonacoEditor } from './components/monaco-editor'
import { getImportMap } from './utils/get-import-map'
import { defaultImportMap } from './utils/constants'
import { getIframeContent } from './utils/get-iframe-content'

export function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [code, setCode] = useState(appCode)
  const [importMap, setImportMap] = useState(JSON.stringify(defaultImportMap, null, 2))

  useEffect(() => {
    try {
      const output = transform(code, {
        transforms: ['typescript', 'jsx'],
        jsxRuntime: 'automatic',
      })

      if (iframeRef.current) {
        const url = URL.createObjectURL(
          new Blob([getIframeContent(output.code, importMap)], { type: 'text/html' })
        )

        iframeRef.current.src = url
      }
    } catch {}
  }, [code])

  return (
    <div className='size-screen flex flex-col'>
      <div className='h-12vh w-full flex'>
        <div className='w-64vw grid place-content-center'>TODO: Operation Bar</div>
        <textarea
          className='flex-1'
          onChange={e => setImportMap(e.target.value)}
          value={`// Import Map\n${importMap}`}
        />
      </div>

      <div className='flex h-88vh'>
        <div className='w-64vw h-full'>
          <MonacoEditor
            langs={['typescript']}
            defaultLanguage='typescript'
            language='typescript'
            defaultPath='index.tsx'
            editorInitialConfig={{}}
            value={code}
            onChange={e => {
              setCode(e ?? '')
              setImportMap(
                JSON.stringify({ ...defaultImportMap, ...getImportMap(e ?? '').imports }, null, 2)
              )
            }}
          />
        </div>
        <iframe className='flex-1 border-1 border-solid border-gray/20' ref={iframeRef} />
      </div>
    </div>
  )
}

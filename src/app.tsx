import { transform } from 'sucrase'
import { useState, useEffect, useRef } from 'react'
import { defaultCode, defaultImportMap, getHTML } from './constants'
import { MonacoEditor } from './components/monaco-editor'
import { getImportMap } from './get-import-map'

export function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [code, setCode] = useState(defaultCode)
  const [importMap, setImportMap] = useState(JSON.stringify(defaultImportMap, null, 2))

  useEffect(() => {
    try {
      const output = transform(code, {
        transforms: ['typescript', 'jsx'],
        jsxRuntime: 'automatic',
      })

      if (iframeRef.current) {
        const url = URL.createObjectURL(
          new Blob([getHTML(output.code, importMap)], { type: 'text/html' })
        )

        iframeRef.current.src = url
      }
    } catch {}
  }, [code])

  return (
    <div className='h-screen w-screen grid place-content-center gap-2'>
      <div className='flex gap-2'>
        <div className='w-800px h-320px'>
          <MonacoEditor
            className='border border-gray border-solid rounded overflow-hidden'
            langs={['typescript']}
            language='typescript'
            value={code}
            defaultLanguage='typescript'
            defaultPath='index.tsx'
            editorInitialConfig={{}}
            onChange={e => {
              setCode(e ?? '')
              setImportMap(
                JSON.stringify({ ...defaultImportMap, ...getImportMap(e ?? '').imports }, null, 2)
              )
            }}
          />
        </div>
        <iframe className='border-gray rounded border-1 border-solid' ref={iframeRef} />
      </div>
      <textarea
        className='w-800px h-200px'
        onChange={e => setImportMap(e.target.value)}
        value={importMap}
      />
    </div>
  )
}

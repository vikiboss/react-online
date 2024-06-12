import { transform } from 'sucrase'
import { useState, useEffect, useRef } from 'react'

import appCode from './templates/app?raw'
import { MonacoEditor } from './components/monaco-editor'
import { getImportMap } from './utils/get-import-map'
import { defaultImportMap } from './utils/constants'
import { getIframeContent } from './utils/get-iframe-content'

export function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [file, setFile] = useState('app.tsx')
  const [code, setCode] = useState(appCode)
  const [importMap, setImportMap] = useState(JSON.stringify(defaultImportMap, null, 2))

  useEffect(() => {
    try {
      const output = transform(code, {
        transforms: ['typescript', 'jsx'],
        jsxRuntime: 'automatic',
        production: true,
      })

      if (iframeRef.current) {
        const url = URL.createObjectURL(
          new Blob([getIframeContent(output.code, importMap)], { type: 'text/html' })
        )

        iframeRef.current.src = url
      }
    } catch {}
  }, [code])

  const files = ['app.tsx']

  const isImportMap = file === 'importmap.json'

  return (
    <div className='size-screen flex'>
      <div className='flex flex-col h-full border-0 border-r border-solid border-gray/32'>
        <div className='h-4vh w-64vw min-h-32px flex justify-between'>
          <div className='flex items-center'>
            {files.map(e => {
              const isActive = e === file

              return (
                <div
                  key={e}
                  onClick={() => setFile(e)}
                  className={
                    'cursor-pointer hover:opacity-92 h-full font-mono flex items-center px-2 py-1' +
                    (isActive ? ' bg-zinc-6/80' : '')
                  }
                >
                  {e}
                </div>
              )
            })}
          </div>
          <div
            onClick={() => setFile('importmap.json')}
            className={
              'cursor-pointer hover:opacity-92 h-full font-mono flex items-center px-2' +
              (isImportMap ? ' bg-zinc-6/80' : '')
            }
          >
            importmap.json
          </div>
        </div>

        <div className='flex flex-1'>
          <div className='w-64vw h-full'>
            <MonacoEditor
              langs={['typescript', 'json']}
              value={isImportMap ? importMap : code}
              language={isImportMap ? 'json' : 'typescript'}
              defaultPath='index.tsx'
              defaultLanguage='typescript'
              onChange={e => {
                // TODO: throttle the code change
                if (isImportMap) {
                  setImportMap(e ?? '')
                } else {
                  setCode(e ?? '')
                  const res = { ...defaultImportMap, ...getImportMap(e ?? '').imports }
                  setImportMap(JSON.stringify(res, null, 2))
                }
              }}
            />
          </div>
        </div>
      </div>
      <iframe className='flex-1 border-0 p-2' ref={iframeRef} />
    </div>
  )
}

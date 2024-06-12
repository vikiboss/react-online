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

  const files = ['app.tsx', 'importmap.json']

  const isImportMap = file === 'importmap.json'

  return (
    <div className='size-screen flex flex-col font-sans'>
      <div className='h-4vh w-full min-h-32px flex justify-between border-0 border-b border-solid border-gray/24'>
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
        <div className='flex items-center'>
          <a className='px-2' href='https://github.com/vikiboss/react-online'>
            Star on GitHub
          </a>
        </div>
      </div>

      <div className='flex h-full border-0 border-r border-solid border-gray/32'>
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
        <iframe className='flex-1 border-0 p-2' ref={iframeRef} />
      </div>
    </div>
  )
}

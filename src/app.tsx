import { useDebouncedFn, useMediaQuery, useMount, useStableFn, useUrlSearchParams } from '@shined/react-use'
import { useEffect, useRef, useState } from 'react'
import { HeaderBar } from './components/header-bar'
import { MonacoEditor } from './components/monaco-editor'
import { useIframeUrl } from './hooks/use-iframe-url'
import appCode from './templates/app?raw'
import { defaultImportMap } from './utils/constants'
import { getImportMap } from './utils/get-import-map'
import { mergeImportMap } from './utils/merge-importmap'

export function App() {
  const ref = useRef<MonacoEditor>(null)
  const [file, setFile] = useState('app.tsx')
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState(appCode)
  const [importMap, setImportMap] = useState(JSON.stringify(defaultImportMap, null, 2))
  const [_sp, setSp] = useUrlSearchParams('hash-params')
  const url = useIframeUrl(code, importMap)
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')
  const files = ['app.tsx', 'Import Map']
  const isImportMap = file === 'Import Map'

  useMount(() => {
    const initialCode = new URLSearchParams(location.hash.replace('#', '')).get('code')
    if (initialCode) {
      setCode(window.atob(initialCode))
    }
  })

  const updateTheme = useStableFn(() => {
    if (!ref.current) return
    const theme = isDark ? 'one-dark-pro' : 'catppuccin-latte'
    ref.current.updateOptions({ theme })
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => void updateTheme(), [isDark])

  const debouncedHandleChange = useDebouncedFn(
    (e?: string) => {
      if (isImportMap) {
        setImportMap(e ?? '')
      } else {
        setSp({ code: e ? window.btoa(e) : undefined })
        setCode(e ?? '')
        const res = mergeImportMap(defaultImportMap, getImportMap(code))
        setImportMap(JSON.stringify(res, null, 2))
      }
    },
    { wait: 500 },
  )

  return (
    <div className="size-screen flex flex-col font-sans">
      <HeaderBar files={files} onSelect={setFile} selected={file} loading={loading} />
      <div className="flex h-full border-0 border-r border-solid border-gray/32">
        <div className="flex flex-1">
          <div className="w-64vw h-full">
            <MonacoEditor
              langs={['typescript', 'json']}
              path={file}
              onAtaStatusChange={setLoading}
              value={isImportMap ? importMap : code}
              defaultLanguage={isImportMap ? 'json' : 'typescript'}
              onMount={(e) => {
                ref.current = e
                updateTheme()
              }}
              onChange={debouncedHandleChange}
            />
          </div>
        </div>
        <iframe title="view" className="flex-1 border-0" src={url} />
      </div>
    </div>
  )
}

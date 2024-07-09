import {
  useDebouncedFn,
  useMediaQuery,
  useMount,
  useStableFn,
  useUpdateEffect,
  useUrlSearchParams,
} from '@shined/react-use'
import { useEffect, useRef } from 'react'
import { HeaderBar } from './components/header-bar'
import { MonacoEditor } from './components/monaco-editor'
import { useIframeUrl } from './hooks/use-iframe-url'
import { defaultImportMap, EntryFileName, getImportMap, globalStore, ImportMapName, mergeImportMap } from './store'

export function App() {
  const [file, codeMap, loadingTypes, importMap, useAutoImportMap, useWaterCSS] = globalStore.useSnapshot((s) => [
    s.currentFile,
    s.codeMap,
    s.loadingTypes,
    s.importMap,
    s.useAutoImportMap,
    s.useWaterCSS,
  ])

  const [isImportMap, isEntry, isAutoImportMap] = [
    file === ImportMapName,
    file === EntryFileName,
    file === ImportMapName && useAutoImportMap,
  ]

  const ref = useRef<MonacoEditor>(null)
  const [_, setSp] = useUrlSearchParams('hash-params')

  const url = useIframeUrl(
    codeMap[EntryFileName],
    useAutoImportMap ? JSON.stringify(importMap, null, 2) : codeMap[ImportMapName],
    [useAutoImportMap, useWaterCSS],
  )

  const isDark = useMediaQuery('(prefers-color-scheme: dark)')

  useMount(() => {
    const initialCode = new URLSearchParams(location.hash.replace('#', '')).get('code')

    if (initialCode) {
      const code = window.atob(initialCode)
      globalStore.mutate.codeMap[EntryFileName] = code
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
    (e = '') => {
      globalStore.mutate.codeMap[file] = e

      if (isEntry) {
        const importMap = mergeImportMap(defaultImportMap, getImportMap(globalStore.mutate.codeMap[EntryFileName]))
        globalStore.mutate.importMap = importMap
        setSp({ code: e ? window.btoa(e) : undefined })
      }
    },
    { wait: 300 },
  )

  useUpdateEffect(() => {
    if (isAutoImportMap) {
      ref.current?.updateOptions({ readOnly: true })
    } else {
      ref.current?.updateOptions({ readOnly: false })
    }
  }, [isAutoImportMap])

  return (
    <div className="size-screen flex flex-col font-sans">
      <HeaderBar
        files={[EntryFileName, ImportMapName]}
        onSelect={(file) => {
          globalStore.mutate.currentFile = file
        }}
        selected={file}
        loadingTypes={loadingTypes}
      />
      <div className="flex h-full border-0 border-r border-solid border-gray/32">
        <div className="flex flex-1">
          <div className="w-64vw h-full">
            <MonacoEditor
              langs={['typescript', 'json']}
              path={isAutoImportMap ? 'Auto Import Map' : file}
              language={isImportMap ? 'json' : 'typescript'}
              value={isAutoImportMap ? JSON.stringify(importMap, null, 2) : codeMap[file]}
              onChange={debouncedHandleChange}
              onAtaStatusChange={(status) => {
                globalStore.mutate.loadingTypes = status
              }}
              onMount={(e) => {
                ref.current = e
                updateTheme()
              }}
            />
          </div>
        </div>
        <iframe title="view" className="flex-1 border-0" src={url} />
      </div>
    </div>
  )
}

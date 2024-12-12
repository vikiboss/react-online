import { cn } from '@/utils/class-names'
import { MonacoEditor } from './monaco-editor'
import { DEFAULT_IMPORT_MAP, EntryFilename, store } from '@/store'
import { useEffect, useRef } from 'react'
import { useDebouncedFn, useMediaQuery, useMount, useStableFn, useUrlSearchParams } from '@shined/react-use'
import { compress, decompress } from '@/utils/url-compression'
import { mergeImportMap, parseImportMapFromCode } from '@/utils/import-map'
import getLanguageByFileName from '@/utils/lang'

export function CodeEditor() {
  const [activeFile, isEditorReady, fileTree] = store.useSnapshot((s) => [
    s.activeFile,
    s.isEditorReady,
    s.fileTree,
  ])

  const ref = useRef<MonacoEditor | null>(null)
  const [_, setSp] = useUrlSearchParams('hash-params')
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')

  useMount(() => {
    store.mutate.isEditorReady = false
    const initialCode = new URLSearchParams(location.hash.replace('#', '')).get('code')

    if (initialCode) {
      const code = decompress(initialCode)
      store.mutate.fileTree[EntryFilename] = code
      const importMap = mergeImportMap(JSON.parse(DEFAULT_IMPORT_MAP), parseImportMapFromCode(code))
      store.mutate.importMap = JSON.stringify(importMap, null, 2)
    }
  })

  const updateTheme = useStableFn(() => {
    if (!ref.current) return
    // const theme = isDark ? 'vs-dark' : 'vs-light'
    const theme = isDark ? 'one-dark-pro' : 'one-light'
    ref.current?.updateOptions({ theme })
    document.documentElement.classList.toggle('dark', isDark)
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => void updateTheme(), [isDark])

  const debouncedHandleChange = useDebouncedFn(
    (e = '') => {
      store.mutate.fileTree[activeFile] = e

      if (activeFile === 'index.tsx') {
        const importMap = mergeImportMap(JSON.parse(DEFAULT_IMPORT_MAP), parseImportMapFromCode(store.mutate.fileTree[EntryFilename]))
        store.mutate.importMap = JSON.stringify(importMap, null, 2)
        setSp({ code: e ? compress(e) : undefined })
      }
    },
    { wait: 300 },
  )


  return (
    <div className="flex flex-1">
      <div className="w-64vw h-full relative">
        <div
          className={cn(
            'absolute grid place-content-center size-full transition-all',
            isDark ? 'text-white bg-black/60' : 'text-dark bg-white/60',
            isEditorReady ? 'z-[-1] opacity-0' : 'z-[99999]',
          )}
        >
          <span className={cn('p-4 rounded-2', isDark ? 'bg-zinc-8 text-white' : 'bg-white text-dark')}>
            Setting up Monaco Editor...
          </span>
        </div>

        <MonacoEditor
          className={cn('w-full h-full', isEditorReady ? 'opacity-100' : 'opacity-0')}
          path={activeFile}
          language={getLanguageByFileName(activeFile)}
          value={fileTree[activeFile]}
          onChange={debouncedHandleChange}
          onAtaDone={() => { }}
          onMount={(e) => {
            ref.current = e
            store.mutate.isEditorReady = true
            updateTheme()
          }}
        />
      </div>
    </div>
  )
}

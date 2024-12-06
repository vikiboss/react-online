import { cn } from '@/utils/class-names'
import { MonacoEditor } from './monaco-editor'
import { defaultImportMap, EntryFileName, getImportMap, globalStore, ImportMapName, mergeImportMap } from '@/store'
import { useEffect, useRef } from 'react'
import { useDebouncedFn, useMediaQuery, useMount, useStableFn, useUpdateEffect, useUrlSearchParams } from '@shined/react-use'
import { compress, decompress } from '@/utils/compression'

export function Editor() {
  const [file, isEditorReady, codeMap, importMap, useAutoImportMap, useWaterCSS] = globalStore.useSnapshot((s) => [
    s.currentFile,
    s.isEditorReady,
    s.sourceCodes,
    s.importMap,
    s.useAutoImportMap,
    s.useWaterCSS,
  ])

  const [isImportMap, isEntry, isAutoImportMap] = [
    file === ImportMapName,
    file === EntryFileName,
    file === ImportMapName && useAutoImportMap,
  ]

  const ref = useRef<MonacoEditor | null>(null)
  const [_, setSp] = useUrlSearchParams('hash-params')
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')

  useMount(() => {
    const initialCode = new URLSearchParams(location.hash.replace('#', '')).get('code')

    if (initialCode) {
      const code = decompress(initialCode)
      globalStore.mutate.sourceCodes[EntryFileName] = code
      const importMap = mergeImportMap(defaultImportMap, getImportMap(code))
      globalStore.mutate.importMap = importMap
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
      globalStore.mutate.sourceCodes[file] = e

      if (isEntry) {
        const importMap = mergeImportMap(defaultImportMap, getImportMap(globalStore.mutate.sourceCodes[EntryFileName]))
        globalStore.mutate.importMap = importMap
        setSp({ code: e ? compress(e) : undefined })
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
          path={isAutoImportMap ? 'Auto Import Map' : file}
          language={isImportMap ? 'json' : 'typescript'}
          value={isAutoImportMap ? JSON.stringify(importMap, null, 2) : codeMap[file]}
          onChange={debouncedHandleChange}
          onAtaDone={() => { }}
          onMount={(e) => {
            ref.current = e
            globalStore.mutate.isEditorReady = true
            updateTheme()
          }}
        />
      </div>
    </div>
  )
}

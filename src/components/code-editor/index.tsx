import { cn } from '@/utils/class-names'
import { MonacoEditor } from './monaco-editor'
import { DEFAULT_IMPORT_MAP, EntryFilename, ImportMapName, configStore, filesStore, editorStore } from '@/stores'
import { useEffect, useRef } from 'react'
import { useDebouncedFn, useMediaQuery, useMount, useStableFn, useUrlSearchParams } from '@shined/react-use'
import { compress, decompress } from '@/utils/url-compression'
import { addNewImportsOnly, mergeImportMap, parseImportMapFromCode } from '@/utils/import-map'
import getLanguageByFileName from '@/utils/lang'

export function CodeEditor() {
  const config = configStore.useSnapshot()
  const { fileTree, activeFile } = filesStore.useSnapshot()
  const { isEditorReady } = editorStore.useSnapshot()

  const ref = useRef<MonacoEditor | null>(null)
  const [_, setSp] = useUrlSearchParams('hash-params')
  const systemIsDark = useMediaQuery('(prefers-color-scheme: dark)')

  // Determine actual theme based on user setting
  const isDark = config.theme === 'system' ? systemIsDark : config.theme === 'dark'

  // Update editor options when config changes
  useEffect(() => {
    if (ref.current) {
      ref.current.updateOptions({
        fontSize: config.editor.fontSize,
        lineNumbers: config.editor.lineNumbers ? 'on' : 'off',
        minimap: { enabled: config.editor.minimap },
        tabSize: config.editor.tabSize,
        wordWrap: config.editor.wordWrap ? 'on' : 'off',
        insertSpaces: true,
        detectIndentation: false,
      })
    }
  }, [config.editor.fontSize, config.editor.lineNumbers, config.editor.minimap, config.editor.tabSize, config.editor.wordWrap])

  useMount(() => {
    editorStore.mutate.isEditorReady = false
    const initialCode = new URLSearchParams(location.hash.replace('#', '')).get('code')

    if (initialCode) {
      const code = decompress(initialCode)
      filesStore.mutate.fileTree[EntryFilename] = code
      const importMapObj = mergeImportMap(JSON.parse(DEFAULT_IMPORT_MAP), parseImportMapFromCode(code))
      filesStore.mutate.importMap = JSON.stringify(importMapObj, null, 2)
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
  useEffect(() => void updateTheme(), [isDark, config.theme])

  const debouncedHandleChange = useDebouncedFn(
    (e = '') => {
      filesStore.mutate.fileTree[activeFile] = e

      if (activeFile === EntryFilename) {
        setSp({ code: e ? compress(e) : undefined })

        // Auto update Import Map if autoImportMap is enabled
        if (config.autoImportMap) {
          try {
            // Get current Import Map (may have been manually edited by user)
            const currentImportMap = JSON.parse(filesStore.mutate.fileTree[ImportMapName] || DEFAULT_IMPORT_MAP)

            // Parse new imports from code
            const newImportsFromCode = parseImportMapFromCode(filesStore.mutate.fileTree[EntryFilename])

            // Incrementally add new imports without overwriting existing ones
            // This preserves user's custom versions (e.g., react@canary)
            const updatedMap = addNewImportsOnly(currentImportMap, newImportsFromCode)

            const importMapStr = JSON.stringify(updatedMap, null, 2)
            filesStore.mutate.importMap = importMapStr
            // Sync to Import Map file for viewing
            filesStore.mutate.fileTree[ImportMapName] = importMapStr
          } catch (error) {
            console.error('Failed to update Import Map:', error)
          }
        }
      }

      if (activeFile === ImportMapName) {
        try {
          // Validate JSON before updating
          JSON.parse(e)
          // Update importMap for preview (both auto and manual mode use this)
          filesStore.mutate.importMap = e
        } catch (error) {
          // Keep the old import map if JSON is invalid
          console.warn('Invalid Import Map JSON:', error)
        }
      }
    },
    { wait: 1200 },
  )

  return (
    <div className="w-full h-full relative">
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
        onAtaDone={() => {}}
        editorInitialConfig={{
          fontSize: config.editor.fontSize,
          lineNumbers: config.editor.lineNumbers ? 'on' : 'off',
          minimap: { enabled: config.editor.minimap },
          tabSize: config.editor.tabSize,
          wordWrap: config.editor.wordWrap ? 'on' : 'off',
          insertSpaces: true,
          detectIndentation: false,
        }}
        onMount={e => {
          ref.current = e
          editorStore.mutate.isEditorReady = true
          updateTheme()
        }}
      />
    </div>
  )
}

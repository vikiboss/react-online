import { Editor } from '@monaco-editor/react'
import { shikiToMonaco } from '@shikijs/monaco'
import { useRef } from 'react'
import { getHighlighter } from 'shiki'
import { setupAta } from './automatic-type-acquisition'
import { monacoEditorConfig } from './monaco-editor-config'

import type { EditorProps } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { BundledLanguage, BundledTheme } from 'shiki'

export interface MonacoEditorProps extends EditorProps {
  editorInitialConfig?: editor.IEditorOptions & editor.IGlobalEditorOptions
  onAtaStatusChange?: (status: boolean) => void
  themes?: BundledTheme[]
  langs?: BundledLanguage[]
}

export type MonacoEditor = editor.IStandaloneCodeEditor
export type Monaco = typeof monaco

export function MonacoEditor(props: MonacoEditorProps) {
  const { onMount, theme, themes = [], langs = [], editorInitialConfig, onAtaStatusChange = () => {}, ...rest } = props

  const ref = useRef<MonacoEditor>(null)

  const defaultProps = {
    width: '100%',
    height: '100%',
    defaultLanguage: 'typescript',
    defaultPath: 'index.tsx',
    defaultValue: 'console.log("hello world!")',
    async onMount(editor: MonacoEditor, monaco: Monaco) {
      ref.current = editor

      const fetchType = setupAta(
        (code, path) => {
          monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
        },
        () => onAtaStatusChange(true),
        () => onAtaStatusChange(false),
      )

      // disable TS semantic and syntax validation
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      })

      // disable CSS validation
      monaco.languages.css.cssDefaults.setOptions({ validate: false })

      editor.onDidChangeModelContent(() => fetchType(editor.getValue()))

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types'],
      })

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      })

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        '<<react-definition-file>>',
        'file:///node_modules/@react/types/index.d.ts',
      )

      fetchType(editor.getValue())

      const highlighter = await getHighlighter({
        themes: ['one-dark-pro', 'catppuccin-latte', ...themes],
        langs: ['tsx', 'jsx', 'javascript', 'typescript', 'json', ...langs],
      })

      shikiToMonaco(highlighter, monaco)

      editor.updateOptions({ ...monacoEditorConfig, ...editorInitialConfig })

      onMount?.(editor as MonacoEditor, monaco)
    },
  }

  return <Editor {...defaultProps} {...rest} />
}

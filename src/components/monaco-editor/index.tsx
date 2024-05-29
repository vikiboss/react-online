import { Editor } from '@monaco-editor/react'
import { setupAta } from './ata'
import { shikiToMonaco } from '@shikijs/monaco'
import { getHighlighter } from 'shiki'
import { monacoEditorConfig } from './monaco-editor-config'

import type { editor } from 'monaco-editor'
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { EditorProps } from '@monaco-editor/react'
import type { BundledTheme, BundledLanguage } from 'shiki'

export interface MonacoEditorProps extends EditorProps {
  editorInitialConfig?: editor.IEditorOptions & editor.IGlobalEditorOptions
  themes?: BundledTheme[]
  langs?: BundledLanguage[]
}

export type Editor = editor.IStandaloneCodeEditor
export type Monaco = typeof monaco

export function MonacoEditor(props: MonacoEditorProps) {
  const { onMount, themes = [], langs = [], editorInitialConfig, ...rest } = props

  const defaultProps = {
    width: '100%',
    height: '100%',
    defaultLanguage: 'javascript',
    defaultPath: 'index.js',
    defaultValue: 'console.log("hello world!")',
    async onMount(editor: Editor, monaco: Monaco) {
      const fetchType = setupAta((code, path) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
      })

      editor.onDidChangeModelContent(() => fetchType(editor.getValue()))

      fetchType(editor.getValue())

      const highlighter = await getHighlighter({
        themes: ['catppuccin-latte', 'one-dark-pro', ...themes],
        langs: ['javascript', 'typescript', 'json', 'ini', ...langs],
      })

      shikiToMonaco(highlighter, monaco)

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.Preserve,
        esModuleInterop: true,
      })

      editor.updateOptions({ ...monacoEditorConfig, ...editorInitialConfig })

      onMount?.(editor as Editor, monaco)
    },
  }

  return <Editor {...defaultProps} {...rest} />
}

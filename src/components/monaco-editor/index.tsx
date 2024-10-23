import { Editor } from '@monaco-editor/react'
import { shikiToMonaco } from '@shikijs/monaco'
import { createHighlighter } from 'shiki'
import { setupAta } from './automatic-type-acquisition'
import { monacoEditorConfig } from './monaco-editor-config'

import type { EditorProps } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import type { BundledLanguage, BundledTheme } from 'shiki'

export interface MonacoEditorProps extends EditorProps {
  editorInitialConfig?: editor.IEditorOptions & editor.IGlobalEditorOptions
  onAtaDone?: () => void
  themes?: BundledTheme[]
  langs?: BundledLanguage[]
}

export type MonacoEditor = editor.IStandaloneCodeEditor
export type Monaco = typeof monaco

export function MonacoEditor(props: MonacoEditorProps) {
  const { onMount, theme, themes = [], langs = [], editorInitialConfig, onAtaDone = () => {}, ...rest } = props

  const defaultProps = {
    width: '100%',
    height: '100%',
    defaultLanguage: 'typescript',
    defaultPath: 'index.tsx',
    defaultValue: 'console.log("hello world!")',
    async onMount(editor: MonacoEditor, monaco: Monaco) {
      const fetchType = setupAta((code, path) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
      }, onAtaDone)

      // disable TS semantic and syntax validation
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      })

      // disable CSS validation
      monaco.languages.css.cssDefaults.setOptions({ validate: false })

      editor.onDidChangeModelContent(() => fetchType(editor.getValue()))

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.Latest,
        noUnusedLocals: false,
        allowNonTsExtensions: true,
        noUnusedParameters: false,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        noEmit: true,
        esModuleInterop: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types'],
      })

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      })

      fetchType(editor.getValue())

      const highlighter = await createHighlighter({
        themes: ['one-light', 'one-dark-pro', ...themes],
        langs: ['typescript', 'tsx', 'javascript', 'jsx', 'html', 'css', 'json', ...langs],
        langAlias: { typescript: 'tsx' },
      })

      shikiToMonaco(highlighter, monaco)

      editor.updateOptions({ ...monacoEditorConfig, ...editorInitialConfig })

      onMount?.(editor as MonacoEditor, monaco)
    },
  }

  return <Editor {...defaultProps} {...rest} />
}

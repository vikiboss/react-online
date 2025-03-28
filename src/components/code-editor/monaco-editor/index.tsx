import getWasm from 'shiki/wasm'
import toast from 'react-hot-toast'
import { Editor, loader } from '@monaco-editor/react'
import { setupAta } from './automatic-type-acquisition'
import { shikiToMonaco } from '@shikijs/monaco'
import { monacoEditorConfig } from './monaco-editor-config'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

import type { editor } from 'monaco-editor'
import type * as monacoApi from 'monaco-editor/esm/vs/editor/editor.api'
import type { EditorProps } from '@monaco-editor/react'

export interface MonacoEditorProps extends EditorProps {
  editorInitialConfig?: editor.IEditorOptions & editor.IGlobalEditorOptions
  onAtaDone?: () => void
  themes?: string[]
  langs?: string[]
}

export type MonacoEditor = editor.IStandaloneCodeEditor
export type Monaco = typeof monacoApi

loader.config({
  paths: {
    vs: 'https://unpkg.com/monaco-editor@0.52.2/min/vs',
  },
})

export function MonacoEditor(props: MonacoEditorProps) {
  const {
    onMount,
    theme,
    themes = [],
    langs = [],
    editorInitialConfig,
    onAtaDone = () => {},
    ...rest
  } = props

  const defaultProps = {
    width: '100%',
    height: '100%',
    // defaultLanguage: 'typescript',
    // defaultPath: 'index.tsx',
    // defaultValue: 'console.log("hello world!")',
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

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        toast.success('Saved!')
      })

      fetchType(editor.getValue())

      // const highlighter = await createHighlighter({
      //   themes: ['one-light', 'one-dark-pro', ...themes],
      //   langs: ['typescript', 'tsx', 'javascript', 'jsx', 'html', 'css', 'json', ...langs],
      //   langAlias: { typescript: 'tsx' },
      // })

      createHighlighterCore({
        themes: [import('shiki/themes/one-dark-pro.mjs'), import('shiki/themes/one-light.mjs')],
        langs: [
          import('shiki/langs/javascript.mjs'),
          import('shiki/langs/typescript.mjs'),
          import('shiki/langs/tsx.mjs'),
          import('shiki/langs/jsx.mjs'),
          import('shiki/langs/json.mjs'),
          import('shiki/langs/html.mjs'),
          import('shiki/langs/css.mjs'),
        ],
        langAlias: { typescript: 'tsx', javascript: 'jsx', jsonc: 'json' },
        loadWasm: getWasm,
        engine: createJavaScriptRegexEngine(),
      }).then(highlighter => {
        shikiToMonaco(highlighter, monaco)
      })

      editor.updateOptions({ ...monacoEditorConfig, ...editorInitialConfig })

      onMount?.(editor as MonacoEditor, monaco)
    },
  }

  return <Editor {...defaultProps} {...rest} />
}

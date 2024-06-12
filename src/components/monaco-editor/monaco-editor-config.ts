import type { editor } from 'monaco-editor'

export const monacoEditorConfig: editor.IEditorOptions & editor.IGlobalEditorOptions = {
  inlayHints: {
    enabled: 'on',
  },
  tabSize: 2,
  guides: {
    bracketPairs: true,
    highlightActiveBracketPair: true,
  },
  hover: {
    delay: 100,
  },
  unicodeHighlight: {
    ambiguousCharacters: false,
  },
  bracketPairColorization: {
    enabled: true,
    independentColorPoolPerBracketType: true,
  },
  find: {
    addExtraSpaceOnTop: false,
    seedSearchStringFromSelection: 'never',
  },
  padding: {
    top: 14,
  },
  cursorSmoothCaretAnimation: 'explicit',
  cursorBlinking: 'smooth',
  contextmenu: false,
  theme: 'one-dark-pro',
  wordWrap: 'on',
  smoothScrolling: true,
  stickyTabStops: true,
  fontLigatures: true,
  fontSize: 14,
  fontFamily:
    "'FiraCode Nerd Font Mono', FiraCode, 思源黑体, 平方, 微软雅黑, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  quickSuggestions: false,
  minimap: {
    enabled: false,
  },
  readOnlyMessage: {
    value: '当前为只读模式，无法直接修改文件内容',
    isTrusted: true,
  },
  autoClosingBrackets: 'always',
  autoClosingComments: 'always',
  autoIndent: 'advanced',
  autoClosingDelete: 'always',
  autoClosingQuotes: 'always',
  autoDetectHighContrast: true,
  autoClosingOvertype: 'always',
} as const

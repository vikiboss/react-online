export interface EditorConfig {
  fontSize: number
  lineNumbers: boolean
  minimap: boolean
  tabSize: number
  wordWrap: boolean
}

export interface Config {
  unoCSS: boolean
  waterCSS: boolean
  autoImportMap: boolean
  theme: 'light' | 'dark' | 'system'
  editor: EditorConfig
}

export interface FileTree {
  [filename: string]: string
}

export interface EditorState {
  loadingTypes: boolean
  isEditorReady: boolean
}

export type Theme = 'light' | 'dark'

export interface ImportMapStructure {
  imports: Record<string, string>
  scopes: Record<string, Record<string, string>>
}

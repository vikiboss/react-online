import { create } from '@shined/reactive'
import type { EditorState } from '@/types'

export const editorStore = create({
  loadingTypes: false,
  isEditorReady: true,
} as EditorState)

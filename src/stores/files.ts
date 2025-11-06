import { create } from '@shined/reactive'
import { DEFAULT_FILE_TREE, DEFAULT_IMPORT_MAP, EntryFilename } from './constants'

import type { FileTree } from '@/types'

interface FilesState {
  fileTree: FileTree
  activeFile: string
  importMap: string
}

export const filesStore = create<FilesState>({
  fileTree: DEFAULT_FILE_TREE,
  activeFile: EntryFilename,
  importMap: DEFAULT_IMPORT_MAP,
})

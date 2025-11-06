import { create } from '@shined/reactive'
import type { Config } from '@/types'

export const configStore = create({
  unoCSS: true,
  waterCSS: true,
  autoImportMap: true,
  theme: 'system',
  editor: {
    fontSize: 14,
    lineNumbers: true,
    minimap: false,
    tabSize: 2,
    wordWrap: true,
  },
} as Config)

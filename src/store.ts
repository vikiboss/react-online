import html from '@/templates/index.html?raw'
import tsx from '@/templates/index.tsx?raw'
import style from '@/templates/style.css?raw'
import { create } from '@shined/reactive'

export const TemplateFilename = 'index.html'
export const EntryFilename = 'index.tsx'
export const StyleFilename = 'style.css'

export const ImportMapName = 'Import Map'

export const DEFAULT_IMPORT_MAP: string = JSON.stringify(
  {
    imports: {
      dayjs: 'https://esm.sh/dayjs',
      react: 'https://esm.sh/react',
      'react/jsx-runtime': 'https://esm.sh/react/jsx-runtime',
      'react-dom/client': 'https://esm.sh/react-dom/client',
      '@shined/react-use': 'https://esm.sh/@shined/react-use',
    },
    scopes: {},
  },
  null,
  2
)

export const store = create({
  config: {
    unoCSS: true,
    waterCSS: true,
    autoImportMap: true,
  },
  fileTree: {
    [TemplateFilename]: html,
    [EntryFilename]: tsx,
    [StyleFilename]: style,
  } as Record<string, string>,
  activeFile: EntryFilename,
  importMap: DEFAULT_IMPORT_MAP,
  loadingTypes: false,
  isEditorReady: true,
})

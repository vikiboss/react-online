import appTsx from '@/templates/app?raw'
import iframeHtml from '@/templates/iframe.html?raw'
import { create } from '@shined/reactive'

export const EntryFileName = 'app.tsx'
export const ImportMapName = 'Import Map'

export const defaultImportMap: ImportMap = {
  imports: {
    dayjs: 'https://esm.sh/dayjs',
    'react-dom/client': 'https://esm.sh/react-dom/client',
    react: 'https://esm.sh/react',
    'react/jsx-runtime': 'https://esm.sh/react/jsx-runtime',
    '@shined/react-use': 'https://esm.sh/@shined/react-use',
  } as Record<string, string>,
  scopes: {},
}

export const globalStore = create({
  useWaterCSS: false,
  useAutoImportMap: true,
  isEditorReady: false,
  html: iframeHtml,
  loadingTypes: false,
  importMap: defaultImportMap,
  currentFile: EntryFileName,
  codeMap: {
    [EntryFileName]: appTsx,
    [ImportMapName]: JSON.stringify(defaultImportMap, null, 2),
  } as Record<string, string>,
})

export interface ImportMap {
  imports?: Record<string, string>
  scopes?: Record<string, string>
}

export function getImportMap(code: string) {
  const importRegex = /import\s+(?:type\s+)?(?:\{[^}]*\}|[^'"]*)\s+from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g

  const importSet = new Set<string>()

  let match: RegExpExecArray | null = importRegex.exec(code)

  while (match !== null) {
    const importPath = match[1] || match[2]
    const isRelative = ['.', '/'].some((e) => importPath.startsWith(e))
    if (!isRelative) importSet.add(importPath)
    match = importRegex.exec(code)
  }

  const importMap: ImportMap = { imports: {}, scopes: {} }

  importMap.imports ??= {}

  for (const pkg of importSet) {
    importMap.imports[pkg] = `https://esm.sh/${pkg}`
  }

  return importMap
}

export function mergeImportMap(...maps: ImportMap[]): ImportMap {
  const importMap: ImportMap = {
    imports: {},
    scopes: {},
  }

  for (const map of maps) {
    importMap.imports = {
      ...importMap.imports,
      ...(map.imports ?? {}),
    }

    importMap.scopes = {
      ...importMap.scopes,
      ...(map.scopes ?? {}),
    }
  }

  return importMap
}

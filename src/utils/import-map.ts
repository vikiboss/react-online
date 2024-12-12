export interface ImportMapObject {
  imports?: Record<string, string>
  scopes?: Record<string, string>
}

export function parseImportMapFromCode(code = '', baseURL = 'https://esm.sh') {
  const importRegex =
    /import\s+(?:type\s+)?(?:\{[^}]*\}|[^'"]*)\s+from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g

  const importSet = new Set<string>()
  let match: RegExpExecArray | null = importRegex.exec(code)

  while (match !== null) {
    const importPath = match[1] || match[2]
    const isRelative = ['.', '/'].some(e => importPath.startsWith(e))
    if (!isRelative) importSet.add(importPath)
    match = importRegex.exec(code)
  }

  const importMap: ImportMapObject = { imports: {}, scopes: {} }
  importMap.imports ??= {}

  for (const pkg of importSet) {
    importMap.imports[pkg] = `${baseURL.replace(/\/+$/, '')}/${pkg}`
  }

  return importMap
}

export function mergeImportMap(...maps: ImportMapObject[]): ImportMapObject {
  const importMap: ImportMapObject = { imports: {}, scopes: {} }

  for (const map of maps) {
    importMap.imports = {
      ...importMap.imports,
      ...map.imports,
    }

    importMap.scopes = {
      ...importMap.scopes,
      ...map.scopes,
    }
  }

  return importMap
}

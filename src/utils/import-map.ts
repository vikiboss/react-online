export interface ImportMapObject {
  imports?: Record<string, string>
  scopes?: Record<string, string>
}

export function parseImportMapFromCode(code = '', baseURL = 'https://esm.sh') {
  const importRegex = /import\s+(?:type\s+)?(?:\{[^}]*\}|[^'"]*)\s+from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g

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

/**
 * Add new imports to existing import map without overwriting existing entries
 * This preserves user's custom package versions (e.g., react@canary)
 */
export function addNewImportsOnly(existingMap: ImportMapObject, newImports: ImportMapObject): ImportMapObject {
  const result: ImportMapObject = {
    imports: { ...existingMap.imports },
    scopes: { ...existingMap.scopes },
  }

  // Only add imports that don't already exist
  for (const [key, value] of Object.entries(newImports.imports || {})) {
    if (!result.imports?.[key]) {
      result.imports = result.imports || {}
      result.imports[key] = value
    }
  }

  // Only add scopes that don't already exist
  for (const [key, value] of Object.entries(newImports.scopes || {})) {
    if (!result.scopes?.[key]) {
      result.scopes = result.scopes || {}
      result.scopes[key] = value
    }
  }

  return result
}

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

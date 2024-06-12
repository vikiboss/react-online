export function getImportMap(code: string) {
  const importRegex =
    /import\s+(?:type\s+)?(?:\{[^}]*\}|[^'"]*)\s+from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g

  const importSet = new Set<string>()

  let match

  while ((match = importRegex.exec(code)) !== null) {
    const importPath = match[1] || match[2]
    const isRelative = ['.', '/'].some(e => importPath.startsWith(e))
    if (!isRelative) importSet.add(importPath)
  }

  const importMap: { imports: Record<string, string> } = { imports: {} }

  importSet.forEach(pkg => {
    importMap.imports[pkg] = `https://esm.sh/${pkg}`
  })

  return importMap
}

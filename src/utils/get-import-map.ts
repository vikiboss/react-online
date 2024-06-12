export function getImportMap(code: string) {
  // 更新正则表达式，以匹配具有 scope 的包（如 @scope/packageName）
  const importRegex =
    /import\s+(?:(?:\{.*?\}|\*\s+as\s+\w+|\w+\s+\{.*?\}|\w+\s+)?\s+from\s+)?(?:"([^"]+)"|'([^']+))'/gm

  // 使用 Set 存储所有唯一的导入
  const importSet = new Set<string>()

  let match

  while ((match = importRegex.exec(code)) !== null) {
    const importPath = match[1] || match[2]

    // 忽略相对导入
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      // 处理具有 scope 的包（如 @scope/packageName）
      const packageMatch = importPath.match(/^(@[^\/]+\/[^\/]+|[^\/]+)/)
      if (packageMatch) {
        importSet.add(packageMatch[0])
      }
    }
  }

  // 使用 esm.sh CDN 为每个识别到的包生成 import map
  const importMap: { imports: Record<string, string> } = {
    imports: {},
  }

  importSet.forEach(pkg => {
    // 对具有 scope 的包正确构造 CDN 链接
    importMap.imports[pkg] = `https://esm.sh/${pkg}`
  })
  return importMap
}

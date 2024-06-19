import type { ImportMap } from './get-import-map'

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

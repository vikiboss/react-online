// @from https://github.com/vuejs/repl/blob/f9f650ada945f7ea597b7e7b51c132c4594bd5cb/src/utils.ts

import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'

export function compress(data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return globalThis.btoa(binary)
}

export function decompress(base64: string): string {
  const binary = globalThis.atob(base64)

  // zlib header (x78), level 9 (xDA)
  if (binary.startsWith('\x78\xDA')) {
    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
  }

  // old unicode hacks for backward compatibility
  // https://base64.guru/developers/javascript/examples/unicode-strings
  return decodeURIComponent(escape(binary))
}

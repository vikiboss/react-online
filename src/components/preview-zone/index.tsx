import { useMemo } from 'react'
import { transform } from 'sucrase'
import html from '../../templates/iframe.html?raw'
import { EntryFileName, globalStore, ImportMapName } from '@/store'

export function PreviewZone() {
  const [codeMap, importMap, useAutoImportMap, useWaterCSS] = globalStore.useSnapshot(s => [
    s.sourceCodes,
    s.importMap,
    s.useAutoImportMap,
    s.useWaterCSS,
  ])

  const finalIM = useAutoImportMap ? importMap : JSON.parse(codeMap[ImportMapName])

  const url = useMemo(() => {
    let finalHtml = ''

    try {
      const output = transform(codeMap[EntryFileName], {
        transforms: ['typescript', 'jsx'],
        jsxRuntime: 'automatic',
        production: true,
        filePath: 'index.js',
        sourceMapOptions: {
          compiledFilename: 'index.min.js',
        },
      })

      finalHtml = getIframeContent(output.code, finalIM, useWaterCSS)
    } catch (e) {
      finalHtml = html.replace(
        '/** SCRIPT */',
        `
        const title = '🤔️ Error occurred, check your cod, please'

        const content = \`
        <div class="p-4">
          <h3 class="text-red font-medium text-xl mb-2">Compile Error, Check your Code</h3>
          <pre class="text-wrap">${e}</pre>
        </div>
        \`

        document.getElementById('root').innerHTML = content
`
      )
    }

    return URL.createObjectURL(new Blob([finalHtml], { type: 'text/html' }))
  }, [codeMap, finalIM, useWaterCSS])

  return <iframe title='view' className='flex-1 border-0' src={url} />
}

function getIframeContent(script = '', importMap: Record<string, string> = {}, useWaterCSS = true) {
  const raw = html
    .replace('<!-- IMPORT_MAP -->', JSON.stringify(importMap, null, 2))
    .replace('/** SCRIPT */', script)

  if (useWaterCSS) {
    return raw.replace(
      '<!-- LINK -->',
      '<!-- LINK -->\n    <link rel="stylesheet" href="https://esm.sh/water.css@2.1.1/out/water.css" />'
    )
  }

  return raw
}

import { useMemo } from 'react'
import { transform } from 'sucrase'
import { EntryFilename, store, ImportMapName } from '@/store'

export function PreviewZone() {
  const [codeMap, importMap] = store.useSnapshot(s => [s.fileTree, s.importMap])

  const config = store.useSnapshot(s => s.config)
  const finalIM = config.autoImportMap ? importMap : codeMap[ImportMapName]

  const url = useMemo(() => {
    let finalHtml = ''

    try {
      const output = transform(
        `
        import ReactDOM from 'react-dom/client' 
        ${codeMap[EntryFilename]}
        const rootDiv = document.getElementById('root')
        rootDiv && ReactDOM.createRoot(rootDiv).render(<App />)
        `,
        {
          transforms: ['typescript', 'jsx'],
          jsxRuntime: 'automatic',
          production: true,
          filePath: 'index.js',
          sourceMapOptions: {
            compiledFilename: 'index.min.js',
          },
        }
      )

      finalHtml = codeMap['index.html']
        .replace(
          '<script type="importmap"></script>',
          `<script type="importmap">${finalIM}</script>`
        )
        .replace('/** SCRIPT_PLACEHOLDER */', output.code)
        .replace('/* STYLE_PLACEHOLDER */', codeMap['style.css'] || '')

      if (config.waterCSS) {
        finalHtml = finalHtml.replace(
          '<!-- LINK_PLACEHOLDER -->',
          '<!-- LINK_PLACEHOLDER -->\n    <link rel="stylesheet" href="https://esm.sh/water.css@2.1.1/out/water.css" />'
        )
      }
    } catch (e) {
      finalHtml = codeMap['index.html'].replace(
        '/** SCRIPT__PLACEHOLDER */',
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
  }, [codeMap, finalIM, config.waterCSS])

  return (
    <iframe
      className='flex-1 border-0'
      src={url}
      title='React Online Preview'
      width='100%'
      allowFullScreen
      sandbox='allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-pointer-lock allow-top-navigation allow-storage-access-by-user-activation allow-orientation-lock'
      referrerPolicy='unsafe-url'
    />
  )
}

import { useMemo } from 'react'
import { transform } from 'sucrase'
import { useMediaQuery } from '@shined/react-use'
import { EntryFilename, ImportMapName, configStore, filesStore } from '@/stores'

export function PreviewZone() {
  const { fileTree: codeMap, importMap: finalIM } = filesStore.useSnapshot()
  const config = configStore.useSnapshot()
  const systemIsDark = useMediaQuery('(prefers-color-scheme: dark)')

  // Determine actual theme based on user setting
  const isDark = config.theme === 'system' ? systemIsDark : config.theme === 'dark'

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
        },
      )

      finalHtml = codeMap['index.html']
        .replace('<script type="importmap"></script>', `<script type="importmap">${finalIM}</script>`)
        .replace('/** SCRIPT_PLACEHOLDER */', output.code)
        .replace('/* STYLE_PLACEHOLDER */', codeMap['style.css'] || '')

      if (config.waterCSS) {
        const waterCssTheme = isDark ? 'dark' : 'light'
        finalHtml = finalHtml.replace(
          '<!-- LINK_PLACEHOLDER -->',
          `<!-- LINK_PLACEHOLDER -->\n    <link rel="stylesheet" href="https://esm.sh/water.css@2.1.1/out/${waterCssTheme}.css" />`,
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
`,
      )
    }

    return URL.createObjectURL(new Blob([finalHtml], { type: 'text/html' }))
  }, [codeMap, finalIM, config.waterCSS, isDark])

  return (
    <iframe
      className="w-full h-full border-0"
      src={url}
      title="React Online Preview"
      allowFullScreen
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-pointer-lock allow-top-navigation allow-storage-access-by-user-activation allow-orientation-lock"
      referrerPolicy="unsafe-url"
    />
  )
}

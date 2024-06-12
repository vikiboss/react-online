import iframe from '../templates/iframe.html?raw'

export function getIframeContent(script: string, importMap: string) {
  return iframe.replace('__IMPORT_MAP__', `{"imports": ${importMap}}`).replace('__SCRIPT__', script)
}

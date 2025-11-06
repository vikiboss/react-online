import typescript from 'typescript'
import { setupTypeAcquisition } from '@typescript/ata'

export function setupAta(
  onDownloadFile?: (code: string, path: string) => void,
  onFinished?: (files: Map<string, string>) => void,
) {
  return setupTypeAcquisition({
    typescript,
    projectName: 'react-playground',
    delegate: {
      receivedFile(code, path) {
        // console.log('received file', path, code.substring(0, 10).replaceAll('\n', '...'))
        return onDownloadFile?.(code, path)
      },
      started() {
        // console.log('stared!!!')
      },
      finished(files) {
        // console.log('finished!!!', [...files.entries()])
        return onFinished?.(files)
      },
      progress(a, b) {
        // console.log('progress!!!', a, b)
      },
      errorMessage(userFacingMessage, error) {
        // console.error('error!!!', userFacingMessage, error)
      },
    },
  })
}

import typescript from 'typescript'
import { setupTypeAcquisition } from '@typescript/ata'

export function setupAta(onDownloadFile: (code: string, path: string) => void) {
  return setupTypeAcquisition({
    typescript,
    projectName: 'react-playground',
    delegate: {
      receivedFile: onDownloadFile,
    },
  })
}

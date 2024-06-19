import { setupTypeAcquisition } from '@typescript/ata'
import typescript from 'typescript'

export function setupAta(
  onDownloadFile?: (code: string, path: string) => void,
  onStarted?: () => void,
  onFinished?: (files: Map<string, string>) => void,
) {
  return setupTypeAcquisition({
    typescript,
    projectName: 'react-playground',
    delegate: {
      receivedFile: onDownloadFile,
      started: onStarted,
      finished: onFinished,
    },
  })
}

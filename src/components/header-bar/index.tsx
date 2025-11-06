import { useState } from 'react'
import { filesStore } from '@/stores'
import { Panel } from '@/components/ui/panel'
import { FileTab } from './file-tab'
import { ActionsBar } from './actions-bar'
import { SettingsPanel } from './settings-panel'

export function HeaderBar() {
  const { fileTree, activeFile } = filesStore.useSnapshot()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <header className="h-[48px] w-full flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-base)]">
        {/* File tabs */}
        <div className="flex items-center h-full overflow-x-auto">
          {Object.keys(fileTree).map(filename => (
            <FileTab
              key={filename}
              filename={filename}
              isActive={filename === activeFile}
              onClick={() => {
                filesStore.mutate.activeFile = filename
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <ActionsBar onSettingsClick={() => setIsSettingsOpen(true)} />
      </header>

      {/* Settings panel */}
      <Panel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
      </Panel>
    </>
  )
}

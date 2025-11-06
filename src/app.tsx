import { CodeEditor } from './components/code-editor'
import { HeaderBar } from './components/header-bar'
import { PreviewZone } from './components/preview-zone'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

export function App() {
  return (
    <div className="size-screen flex flex-col font-sans bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <HeaderBar />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={60} minSize={16}>
          <CodeEditor />
        </Panel>
        <PanelResizeHandle className="w-1 bg-[var(--color-border)] hover:bg-[var(--color-primary)] transition-colors cursor-col-resize" />
        <Panel defaultSize={40} minSize={16}>
          <PreviewZone />
        </Panel>
      </PanelGroup>
    </div>
  )
}

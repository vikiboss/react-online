import { Checkbox } from '@/components/ui/checkbox'
import { IconButton } from '@/components/ui/icon-button'
import { configStore } from '@/stores'

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const config = configStore.useSnapshot()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Settings</h2>
        <IconButton
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          }
          onClick={onClose}
          tooltip="Close settings"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Editor Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Editor</h3>

          {/* Font Size */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--color-text-primary)] flex items-center justify-between">
              <span>Font Size</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{config.editor.fontSize}px</span>
            </label>
            <input
              type="range"
              min="8"
              max="36"
              value={config.editor.fontSize}
              onChange={e => {
                configStore.mutate.editor.fontSize = Number(e.target.value)
              }}
              className="w-full h-2 bg-[var(--color-bg-elevated)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
            />
          </div>

          {/* Tab Size */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--color-text-primary)] flex items-center justify-between">
              <span>Tab Size</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{config.editor.tabSize} spaces</span>
            </label>
            <div className="flex gap-2">
              {[2, 4].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    configStore.mutate.editor.tabSize = size
                  }}
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    config.editor.tabSize === size
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Checkbox
            id="show-line-numbers"
            label="Show Line Numbers"
            checked={config.editor.lineNumbers}
            onChange={e => {
              configStore.mutate.editor.lineNumbers = e.target.checked
            }}
          />

          <Checkbox
            id="show-minimap"
            label="Show Minimap"
            checked={config.editor.minimap}
            onChange={e => {
              configStore.mutate.editor.minimap = e.target.checked
            }}
          />

          <Checkbox
            id="word-wrap"
            label="Word Wrap"
            checked={config.editor.wordWrap}
            onChange={e => {
              configStore.mutate.editor.wordWrap = e.target.checked
            }}
          />
        </div>

        {/* Appearance */}
        <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Appearance</h3>

          {/* Theme */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--color-text-primary)]">Theme</label>
            <div className="flex gap-2">
              {[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    configStore.mutate.theme = value as 'light' | 'dark' | 'system'
                  }}
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    config.theme === value
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Features</h3>

          <Checkbox
            id="use-water-css"
            label="Use Water.css"
            checked={config.waterCSS}
            onChange={e => {
              configStore.mutate.waterCSS = e.target.checked
            }}
          />

          <Checkbox
            id="use-auto-import-map"
            label="Auto Import Map"
            checked={config.autoImportMap}
            onChange={e => {
              configStore.mutate.autoImportMap = e.target.checked
            }}
          />

          <div className="pt-2">
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Auto Import Map: Automatically detect and add imports from your code to the Import Map
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

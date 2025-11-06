import { cn } from '@/utils/class-names'
import type { ReactNode } from 'react'

interface PanelProps {
  isOpen: boolean
  onClose?: () => void
  children: ReactNode
  className?: string
}

export function Panel({ isOpen, onClose, children, className }: PanelProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-[var(--z-modal-backdrop)] transition-opacity"
        onClick={onClose}
        onKeyDown={e => e.key === 'Escape' && onClose?.()}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 bg-[var(--color-bg-base)]',
          'border-l border-[var(--color-border)]',
          'shadow-[var(--shadow-xl)] z-[var(--z-modal)] transform transition-transform',
          'overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          className,
        )}
      >
        {children}
      </div>
    </>
  )
}

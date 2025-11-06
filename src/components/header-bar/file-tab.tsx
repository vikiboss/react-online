import { cn } from '@/utils/class-names'

interface FileTabProps {
  filename: string
  isActive: boolean
  onClick: () => void
}

export function FileTab({ filename, isActive, onClick }: FileTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-full px-4 flex items-center text-sm font-medium transition-colors',
        'border-0 border-b-2 border-solid cursor-pointer',
        isActive
          ? 'bg-[var(--color-bg-base)] text-[var(--color-text-primary)] border-[var(--color-primary)]'
          : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-transparent hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]',
      )}
    >
      {filename}
    </button>
  )
}

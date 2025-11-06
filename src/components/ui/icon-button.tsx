import { cn } from '@/utils/class-names'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  size?: 'sm' | 'md' | 'lg'
  tooltip?: string
}

export function IconButton({ icon, size = 'md', tooltip, className, ...props }: IconButtonProps) {
  const sizeStyles = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-10 h-10 text-lg',
  }

  return (
    <button
      type="button"
      title={tooltip}
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-colors',
        'hover:bg-[var(--color-bg-hover)]',
        'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  )
}

import { cn } from '@/utils/class-names'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({ variant = 'secondary', size = 'md', className, children, ...props }: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white',
    secondary: 'bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]',
    ghost: 'hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
  }

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button type="button" className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </button>
  )
}

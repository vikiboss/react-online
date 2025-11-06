import { cn } from '@/utils/class-names'
import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={checkboxId}
        className={cn(
          'w-4 h-4 rounded border-[var(--color-border)]',
          'text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0',
          'cursor-pointer transition-colors',
          className,
        )}
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className="text-sm text-[var(--color-text-primary)] cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  )
}

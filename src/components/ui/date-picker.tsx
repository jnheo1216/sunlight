import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

function DatePicker({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type='date'
      className={cn(
        'flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        className,
      )}
      {...props}
    />
  )
}

export { DatePicker }

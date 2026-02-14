import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
        secondary: 'bg-[var(--color-surface-muted)] text-[var(--color-fg-muted)]',
        danger: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
        success: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
        warning: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }

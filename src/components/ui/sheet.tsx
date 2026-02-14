import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close

function SheetContent({
  side = 'right',
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: 'left' | 'right'
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-black/45' />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 h-full w-[88vw] max-w-sm border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]',
          side === 'right' ? 'right-0 top-0 border-l' : 'left-0 top-0 border-r',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className='absolute right-3 top-3 rounded-md p-1 hover:bg-[var(--color-surface-muted)]'>
          <X className='h-4 w-4' />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent }

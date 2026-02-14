import { Flower2, Droplets, Sprout } from 'lucide-react'

import { CareStatusBadge } from '@/components/plant/CareStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { CareSchedule } from '@/types/domain'

interface ScheduleSummaryProps {
  schedule: CareSchedule | null | undefined
}

export function ScheduleSummary({ schedule }: ScheduleSummaryProps) {
  const items = [
    {
      key: 'WATER',
      label: '다음 물 주기',
      date: schedule?.nextWateringAt,
      status: schedule?.wateringStatus ?? 'UNSCHEDULED',
      icon: Droplets,
    },
    {
      key: 'FERTILIZE',
      label: '다음 비료 주기',
      date: schedule?.nextFertilizingAt,
      status: schedule?.fertilizingStatus ?? 'UNSCHEDULED',
      icon: Flower2,
    },
    {
      key: 'REPOT',
      label: '다음 분갈이',
      date: schedule?.nextRepotAt,
      status: schedule?.repotStatus ?? 'UNSCHEDULED',
      icon: Sprout,
    },
  ] as const

  return (
    <Card>
      <CardHeader>
        <CardTitle>케어 일정 요약</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-3 md:grid-cols-3'>
        {items.map((item) => (
          <div
            key={item.key}
            className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3'
          >
            <p className='mb-2 inline-flex items-center gap-1.5 text-sm text-[var(--color-fg-muted)]'>
              <item.icon className='h-4 w-4' />
              {item.label}
            </p>
            <p className='mb-2 text-sm font-semibold'>{formatDate(item.date)}</p>
            <CareStatusBadge status={item.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

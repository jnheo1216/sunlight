import { Droplets, Sprout, Flower2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CareStatusBadge } from '@/components/plant/CareStatusBadge'
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent, CardHeader } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { CareSchedule, Plant } from '@/types/domain'

interface PlantCardProps {
  plant: Plant
  schedule?: CareSchedule
  coverUrl?: string | null
}

export function PlantCard({ plant, schedule, coverUrl }: PlantCardProps) {
  return (
    <Card className='group relative overflow-hidden p-0'>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#dff2db]/80 to-transparent' />
      <CardHeader className='relative mb-0 flex-row items-center justify-between gap-3 p-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <Avatar className='h-11 w-11 border-none shadow-sm'>
            <AvatarImage src={coverUrl ?? undefined} alt={`${plant.name} 대표 이미지`} />
            <AvatarFallback>{plant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <h3 className='truncate text-base font-semibold'>{plant.name}</h3>
            <p className='truncate text-sm text-[var(--color-fg-muted)]'>
              {plant.species || '종류 미입력'}
            </p>
          </div>
        </div>
        <Button asChild variant='ghost' size='sm'>
          <Link to={`/plants/${plant.id}`}>상세</Link>
        </Button>
      </CardHeader>
      <CardContent className='space-y-3 p-4 pt-0'>
        <div className='grid grid-cols-3 gap-2 text-xs'>
          <div className='rounded-xl bg-[var(--color-surface-muted)] p-2'>
            <p className='mb-1 inline-flex items-center gap-1 text-[var(--color-fg-muted)]'>
              <Droplets className='h-3.5 w-3.5' /> 물
            </p>
            <CareStatusBadge status={schedule?.wateringStatus ?? 'UNSCHEDULED'} />
          </div>
          <div className='rounded-xl bg-[var(--color-surface-muted)] p-2'>
            <p className='mb-1 inline-flex items-center gap-1 text-[var(--color-fg-muted)]'>
              <Flower2 className='h-3.5 w-3.5' /> 비료
            </p>
            <CareStatusBadge status={schedule?.fertilizingStatus ?? 'UNSCHEDULED'} />
          </div>
          <div className='rounded-xl bg-[var(--color-surface-muted)] p-2'>
            <p className='mb-1 inline-flex items-center gap-1 text-[var(--color-fg-muted)]'>
              <Sprout className='h-3.5 w-3.5' /> 분갈이
            </p>
            <CareStatusBadge status={schedule?.repotStatus ?? 'UNSCHEDULED'} />
          </div>
        </div>

        <div className='flex items-center justify-between text-xs text-[var(--color-fg-muted)]'>
          <span>다음 분갈이</span>
          <span className='font-medium text-[var(--color-fg)]'>{formatDate(plant.nextRepotAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

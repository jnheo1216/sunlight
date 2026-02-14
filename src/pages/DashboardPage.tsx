import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { addDays, formatISO } from 'date-fns'
import { ArrowRight, CalendarClock } from 'lucide-react'

import { CareStatusBadge } from '@/components/plant/CareStatusBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui'
import { useSchedule } from '@/features/schedule/api/useSchedule'
import { formatDate } from '@/lib/utils'

export function DashboardPage() {
  const range = useMemo(
    () => {
      const now = new Date()

      return {
        from: formatISO(now, { representation: 'date' }),
        to: formatISO(addDays(now, 14), { representation: 'date' }),
      }
    },
    [],
  )

  const { data: events, isLoading, error } = useSchedule(range)

  const upcoming = (events ?? []).filter((event) => !event.completed).slice(0, 8)
  const completed = (events ?? []).filter((event) => event.completed).slice(0, 5)

  if (isLoading) {
    return <p className='text-sm text-[var(--color-fg-muted)]'>대시보드 로딩 중...</p>
  }

  if (error) {
    return <p className='text-sm text-[var(--color-danger)]'>대시보드 데이터를 불러오지 못했습니다.</p>
  }

  return (
    <div className='space-y-5'>
      <Card>
        <CardHeader>
          <CardTitle>오늘과 다가오는 일정</CardTitle>
          <CardDescription>물 주기, 비료 주기, 분갈이 예정 작업</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-2'>
          {upcoming.length === 0 ? (
            <p className='text-sm text-[var(--color-fg-muted)]'>예정 작업이 없습니다.</p>
          ) : (
            upcoming.map((event) => (
              <Link
                key={event.id}
                to={`/plants/${event.plantId}`}
                className='flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 hover:bg-[color-mix(in_srgb,var(--color-surface-muted),white_28%)]'
              >
                <div>
                  <p className='text-sm font-medium'>{event.plantName}</p>
                  <p className='text-xs text-[var(--color-fg-muted)]'>
                    {event.type} · {formatDate(event.startsAt)}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <CareStatusBadge status={event.status} />
                  <ArrowRight className='h-4 w-4 text-[var(--color-fg-muted)]' />
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <div className='grid gap-5 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>최근 완료 이력</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {completed.length === 0 ? (
              <p className='text-sm text-[var(--color-fg-muted)]'>완료 이력이 없습니다.</p>
            ) : (
              completed.map((event) => (
                <div
                  key={event.id}
                  className='rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm'
                >
                  <p className='font-medium'>{event.plantName}</p>
                  <p className='text-xs text-[var(--color-fg-muted)]'>
                    {event.type} · {formatDate(event.startsAt)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빠른 이동</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-2'>
            <Button asChild variant='secondary'>
              <Link to='/plants'>식물 목록 보기</Link>
            </Button>
            <Button asChild variant='secondary'>
              <Link to='/plants/new'>새 식물 등록</Link>
            </Button>
            <Button asChild variant='secondary'>
              <Link to='/calendar'>캘린더 열기</Link>
            </Button>
            <p className='mt-1 inline-flex items-center gap-2 text-xs text-[var(--color-fg-muted)]'>
              <CalendarClock className='h-3.5 w-3.5' />
              일정은 로컬 타임존 기준으로 표시됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

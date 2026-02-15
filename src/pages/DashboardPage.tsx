import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { addDays, formatISO, isSameDay, parseISO } from 'date-fns'
import { ArrowRight, CalendarClock } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui'
import { useSchedule } from '@/features/schedule/api/useSchedule'
import { formatDate } from '@/lib/utils'
import { careEventLabel } from '@/services/scheduleService'

export function DashboardPage() {
  const range = useMemo(() => {
    const now = new Date()

    return {
      from: formatISO(addDays(now, -14), { representation: 'date' }),
      to: formatISO(addDays(now, 1), { representation: 'date' }),
    }
  }, [])

  const { data: events, isLoading, error } = useSchedule(range)

  const recentLogs = [...(events ?? [])]
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
    .slice(0, 10)

  const todayLogs = (events ?? [])
    .filter((event) => isSameDay(parseISO(event.startsAt), new Date()))
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())

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
          <CardTitle>오늘 기록</CardTitle>
          <CardDescription>오늘 입력된 물/비료/분갈이 기록</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-2'>
          {todayLogs.length === 0 ? (
            <p className='text-sm text-[var(--color-fg-muted)]'>오늘 기록이 없습니다.</p>
          ) : (
            todayLogs.map((event) => (
              <Link
                key={event.id}
                to={`/plants/${event.plantId}`}
                className='flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 hover:bg-[color-mix(in_srgb,var(--color-surface-muted),white_28%)]'
              >
                <div>
                  <p className='text-sm font-medium'>{event.plantName}</p>
                  <p className='text-xs text-[var(--color-fg-muted)]'>
                    {careEventLabel(event.type)} · {formatDate(event.startsAt)}
                    {event.type === 'FERTILIZE' && event.fertilizerName
                      ? ` · ${event.fertilizerName}`
                      : ''}
                  </p>
                </div>
                <ArrowRight className='h-4 w-4 text-[var(--color-fg-muted)]' />
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <div className='grid gap-5 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {recentLogs.length === 0 ? (
              <p className='text-sm text-[var(--color-fg-muted)]'>최근 활동이 없습니다.</p>
            ) : (
              recentLogs.map((event) => (
                <div
                  key={event.id}
                  className='rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm'
                >
                  <p className='font-medium'>{event.plantName}</p>
                  <p className='text-xs text-[var(--color-fg-muted)]'>
                    {careEventLabel(event.type)} · {formatDate(event.startsAt)}
                    {event.type === 'FERTILIZE' && event.fertilizerName
                      ? ` · ${event.fertilizerName}`
                      : ''}
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
              <Link to='/calendar'>기록 캘린더 열기</Link>
            </Button>
            <p className='mt-1 inline-flex items-center gap-2 text-xs text-[var(--color-fg-muted)]'>
              <CalendarClock className='h-3.5 w-3.5' />
              기록은 로컬 타임존 기준으로 표시됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

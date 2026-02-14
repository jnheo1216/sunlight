import { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import type { DatesSetArg, EventClickArg } from '@fullcalendar/core/index.js'
import { addDays } from 'date-fns'
import koLocale from '@fullcalendar/core/locales/ko'

import { CalendarFilters, type CalendarFilterState, type CalendarFilterType } from '@/components/plant/CalendarFilters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useSchedule } from '@/features/schedule/api/useSchedule'
import { formatDate } from '@/lib/utils'
import { toCalendarEvents } from '@/services/scheduleService'

export function CalendarPage() {
  const [range, setRange] = useState(() => {
    const now = new Date()

    return {
      from: now.toISOString().slice(0, 10),
      to: addDays(now, 31).toISOString().slice(0, 10),
    }
  })
  const [typeFilter, setTypeFilter] = useState<CalendarFilterType>('ALL')
  const [stateFilter, setStateFilter] = useState<CalendarFilterState>('ALL')
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string
    date: string
    status: string
    completed: boolean
  } | null>(null)

  const { data, isLoading, error } = useSchedule(range)

  const filtered = useMemo(() => {
    return (data ?? []).filter((item) => {
      const typeMatch = typeFilter === 'ALL' ? true : item.type === typeFilter
      const stateMatch =
        stateFilter === 'ALL'
          ? true
          : stateFilter === 'COMPLETED'
            ? item.completed
            : !item.completed

      return typeMatch && stateMatch
    })
  }, [data, stateFilter, typeFilter])

  const events = useMemo(() => toCalendarEvents(filtered), [filtered])

  const handleDatesSet = (arg: DatesSetArg) => {
    setRange({
      from: arg.startStr.slice(0, 10),
      to: arg.endStr.slice(0, 10),
    })
  }

  const handleEventClick = (arg: EventClickArg) => {
    const extended = arg.event.extendedProps as {
      status: string
      completed: boolean
    }

    setSelectedEvent({
      title: arg.event.title,
      date: arg.event.start?.toISOString() ?? '',
      status: extended.status,
      completed: extended.completed,
    })
  }

  if (isLoading) {
    return <p className='text-sm text-[var(--color-fg-muted)]'>캘린더 로딩 중...</p>
  }

  if (error) {
    return <p className='text-sm text-[var(--color-danger)]'>캘린더 데이터를 불러오지 못했습니다.</p>
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>케어 캘린더</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <CalendarFilters
            type={typeFilter}
            state={stateFilter}
            onTypeChange={setTypeFilter}
            onStateChange={setStateFilter}
          />

          <div className='overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2'>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView='dayGridMonth'
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek',
              }}
              locale={koLocale}
              events={events}
              height='auto'
              datesSet={handleDatesSet}
              eventClick={handleEventClick}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>선택 일정 상세</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedEvent ? (
            <div className='space-y-1 text-sm'>
              <p className='font-semibold'>{selectedEvent.title}</p>
              <p className='text-[var(--color-fg-muted)]'>날짜: {formatDate(selectedEvent.date)}</p>
              <p className='text-[var(--color-fg-muted)]'>상태: {selectedEvent.status}</p>
              <p className='text-[var(--color-fg-muted)]'>유형: {selectedEvent.completed ? '완료 이력' : '예정 일정'}</p>
            </div>
          ) : (
            <p className='text-sm text-[var(--color-fg-muted)]'>캘린더에서 일정을 선택해주세요.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

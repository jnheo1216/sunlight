import { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core/index.js'
import koLocale from '@fullcalendar/core/locales/ko'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { formatDateTime } from '@/lib/utils'
import { careEventColor, careEventLabel } from '@/services/scheduleService'
import type { CareEventType, CareLog } from '@/types/domain'

interface PlantCareHistoryCalendarProps {
  logs: CareLog[]
}

interface SelectedCalendarItem {
  id: string
  type: CareEventType
  startsAt: string
  fertilizerName: string | null
  note: string | null
}

function itemLabel(type: CareEventType, fertilizerName: string | null): string {
  if (type === 'FERTILIZE' && fertilizerName) {
    return `${careEventLabel(type)} · ${fertilizerName}`
  }

  return careEventLabel(type)
}

export function PlantCareHistoryCalendar({ logs }: PlantCareHistoryCalendarProps) {
  const initialView = typeof window !== 'undefined' && window.innerWidth < 768 ? 'listMonth' : 'dayGridMonth'
  const [selected, setSelected] = useState<SelectedCalendarItem | null>(null)

  const events = useMemo(
    () =>
      logs.map((log) => ({
        id: log.id,
        title: itemLabel(log.eventType, log.fertilizerName),
        start: log.occurredAt,
        allDay: true,
        color: careEventColor(log.eventType),
        extendedProps: {
          type: log.eventType,
          startsAt: log.occurredAt,
          fertilizerName: log.fertilizerName,
          note: log.note,
        },
      })),
    [logs],
  )

  const handleEventClick = (arg: EventClickArg) => {
    const extended = arg.event.extendedProps as {
      type: CareEventType
      startsAt: string
      fertilizerName: string | null
      note: string | null
    }

    setSelected({
      id: arg.event.id,
      type: extended.type,
      startsAt: extended.startsAt,
      fertilizerName: extended.fertilizerName,
      note: extended.note,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>이력 달력</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-wrap items-center gap-3 text-xs text-[var(--color-fg-muted)]'>
          <span className='inline-flex items-center gap-1'>
            <span className='h-2.5 w-2.5 rounded-full bg-[#3772ff]' /> 물
          </span>
          <span className='inline-flex items-center gap-1'>
            <span className='h-2.5 w-2.5 rounded-full bg-[#f59f00]' /> 비료
          </span>
          <span className='inline-flex items-center gap-1'>
            <span className='h-2.5 w-2.5 rounded-full bg-[#9c36b5]' /> 분갈이
          </span>
        </div>

        <div className='overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2'>
          <FullCalendar
            plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
            initialView={initialView}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,listMonth',
            }}
            locale={koLocale}
            events={events}
            height='auto'
            eventClick={handleEventClick}
          />
        </div>

        <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3'>
          {selected ? (
            <div className='space-y-1 text-sm'>
              <p className='font-semibold'>{itemLabel(selected.type, selected.fertilizerName)}</p>
              <p className='text-[var(--color-fg-muted)]'>기록 시각: {formatDateTime(selected.startsAt)}</p>
              {selected.note ? (
                <p className='text-[var(--color-fg-muted)]'>메모: {selected.note}</p>
              ) : (
                <p className='text-[var(--color-fg-muted)]'>메모 없음</p>
              )}
            </div>
          ) : (
            <p className='text-sm text-[var(--color-fg-muted)]'>달력에서 기록을 선택하면 상세가 표시됩니다.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

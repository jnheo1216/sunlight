import { addDays, endOfDay, parseISO, startOfDay } from 'date-fns'

import { requireSupabase } from '@/lib/supabase'
import type { CareEventType, CareScheduleEvent, ScheduleRange } from '@/types/domain'

export function careEventColor(type: CareEventType): string {
  if (type === 'WATER') {
    return '#3772ff'
  }

  if (type === 'FERTILIZE') {
    return '#f59f00'
  }

  return '#9c36b5'
}

export function careEventLabel(type: CareEventType): string {
  if (type === 'WATER') {
    return '물 주기'
  }

  if (type === 'FERTILIZE') {
    return '비료 주기'
  }

  return '분갈이'
}

export async function listCareEvents(range: ScheduleRange): Promise<CareScheduleEvent[]> {
  const supabase = requireSupabase()

  const [logsResponse, plantsResponse] = await Promise.all([
    supabase
      .from('care_logs')
      .select('*')
      .gte('occurred_at', startOfDay(parseISO(range.from)).toISOString())
      .lte('occurred_at', endOfDay(parseISO(range.to)).toISOString())
      .order('occurred_at', { ascending: false }),
    supabase.from('plants').select('id, name'),
  ])

  if (logsResponse.error) {
    throw logsResponse.error
  }

  if (plantsResponse.error) {
    throw plantsResponse.error
  }

  const plantNameMap = new Map(plantsResponse.data.map((plant) => [plant.id, plant.name]))

  return logsResponse.data
    .map((log) => ({
      id: log.id,
      plantId: log.plant_id,
      plantName: plantNameMap.get(log.plant_id) ?? '알 수 없는 식물',
      type: log.event_type,
      startsAt: log.occurred_at,
      fertilizerName: log.fertilizer_name,
      note: log.note,
    }))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
}

export function toCalendarEvents(events: CareScheduleEvent[]) {
  return events.map((event) => {
    const date = parseISO(event.startsAt)
    const subLabel =
      event.type === 'FERTILIZE' && event.fertilizerName
        ? ` · ${event.fertilizerName}`
        : ''

    return {
      id: event.id,
      title: `${event.plantName} · ${careEventLabel(event.type)}${subLabel}`,
      start: event.startsAt,
      end: addDays(date, 1).toISOString(),
      allDay: true,
      color: careEventColor(event.type),
      extendedProps: event,
    }
  })
}

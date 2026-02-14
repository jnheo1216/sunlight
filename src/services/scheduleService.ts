import { addDays, endOfDay, isAfter, isBefore, parseISO, startOfDay } from 'date-fns'

import { requireSupabase } from '@/lib/supabase'
import type { CareLog, CareSchedule, CareScheduleEvent, ScheduleRange } from '@/types/domain'
import type { Database } from '@/types/supabase'

function mapScheduleRow(row: Database['public']['Views']['v_care_schedule']['Row']): CareSchedule {
  return {
    plantId: row.plant_id,
    plantName: row.plant_name,
    nextWateringAt: row.next_watering_at,
    nextFertilizingAt: row.next_fertilizing_at,
    nextRepotAt: row.next_repot_at,
    wateringStatus: row.watering_status,
    fertilizingStatus: row.fertilizing_status,
    repotStatus: row.repot_status,
  }
}

function mapLogRow(row: Database['public']['Tables']['care_logs']['Row']): CareLog {
  return {
    id: row.id,
    plantId: row.plant_id,
    eventType: row.event_type,
    occurredAt: row.occurred_at,
    note: row.note,
    createdAt: row.created_at,
  }
}

function isInsideRange(value: string | null, range: ScheduleRange): boolean {
  if (!value) {
    return false
  }

  const date = parseISO(value)
  return !isBefore(date, startOfDay(parseISO(range.from))) && !isAfter(date, endOfDay(parseISO(range.to)))
}

function typeColor(type: CareScheduleEvent['type'], completed: boolean): string {
  if (completed) {
    return '#4f9f6c'
  }

  if (type === 'WATER') {
    return '#3772ff'
  }

  if (type === 'FERTILIZE') {
    return '#f59f00'
  }

  return '#9c36b5'
}

function statusByType(schedule: CareSchedule, type: CareScheduleEvent['type']) {
  if (type === 'WATER') {
    return schedule.wateringStatus
  }

  if (type === 'FERTILIZE') {
    return schedule.fertilizingStatus
  }

  return schedule.repotStatus
}

export async function listCareSchedules(): Promise<CareSchedule[]> {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('v_care_schedule')
    .select('*')
    .order('plant_name', { ascending: true })

  if (error) {
    throw error
  }

  return data.map(mapScheduleRow)
}

export async function listCareEvents(range: ScheduleRange): Promise<CareScheduleEvent[]> {
  const supabase = requireSupabase()
  const [scheduleRows, logRows] = await Promise.all([
    listCareSchedules(),
    supabase
      .from('care_logs')
      .select('*')
      .gte('occurred_at', startOfDay(parseISO(range.from)).toISOString())
      .lte('occurred_at', endOfDay(parseISO(range.to)).toISOString())
      .order('occurred_at', { ascending: false }),
  ])

  if (logRows.error) {
    throw logRows.error
  }

  const completedEvents: CareScheduleEvent[] = logRows.data.map((log) => {
    const mapped = mapLogRow(log)
    const matchedPlant = scheduleRows.find((item) => item.plantId === mapped.plantId)

    return {
      id: mapped.id,
      plantId: mapped.plantId,
      plantName: matchedPlant?.plantName ?? '알 수 없는 식물',
      type: mapped.eventType,
      startsAt: mapped.occurredAt,
      status: 'DUE',
      completed: true,
    }
  })

  const plannedEvents: CareScheduleEvent[] = []

  for (const schedule of scheduleRows) {
    const candidates: Array<{ type: CareScheduleEvent['type']; at: string | null }> = [
      { type: 'WATER', at: schedule.nextWateringAt },
      { type: 'FERTILIZE', at: schedule.nextFertilizingAt },
      { type: 'REPOT', at: schedule.nextRepotAt },
    ]

    for (const candidate of candidates) {
      if (!isInsideRange(candidate.at, range)) {
        continue
      }

      if (!candidate.at) {
        continue
      }

      plannedEvents.push({
        id: `${schedule.plantId}-${candidate.type}-${candidate.at}`,
        plantId: schedule.plantId,
        plantName: schedule.plantName,
        type: candidate.type,
        startsAt: candidate.at,
        status: statusByType(schedule, candidate.type),
        completed: false,
      })
    }
  }

  return [...plannedEvents, ...completedEvents].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  )
}

export function toCalendarEvents(events: CareScheduleEvent[]) {
  return events.map((event) => {
    const date = parseISO(event.startsAt)

    return {
      id: event.id,
      title: `${event.completed ? '완료' : '예정'} · ${event.plantName} · ${event.type}`,
      start: event.startsAt,
      end: addDays(date, 1).toISOString(),
      allDay: true,
      color: typeColor(event.type, event.completed),
      extendedProps: event,
    }
  })
}

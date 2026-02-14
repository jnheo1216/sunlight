import { addDays, differenceInCalendarDays, isValid, parseISO, startOfDay } from 'date-fns'

import type { CareLog, ScheduleStatus } from '@/types/domain'

interface NextCareInput {
  intervalDays: number
  lastOccurredAt: string | null
  overrideAt: string | null
  fallbackFrom: string
}

function safeDate(value: string): Date | null {
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : null
}

export function calculateNextCareAt({
  intervalDays,
  lastOccurredAt,
  overrideAt,
  fallbackFrom,
}: NextCareInput): string | null {
  if (overrideAt) {
    const overrideDate = safeDate(overrideAt)
    return overrideDate ? overrideDate.toISOString() : null
  }

  const reference = lastOccurredAt ? safeDate(lastOccurredAt) : safeDate(fallbackFrom)
  if (!reference) {
    return null
  }

  return addDays(reference, intervalDays).toISOString()
}

export function getScheduleStatus(nextAt: string | null, nowInput = new Date()): ScheduleStatus {
  if (!nextAt) {
    return 'UNSCHEDULED'
  }

  const date = safeDate(nextAt)
  if (!date) {
    return 'UNSCHEDULED'
  }

  const diff = differenceInCalendarDays(startOfDay(date), startOfDay(nowInput))

  if (diff < 0) {
    return 'OVERDUE'
  }

  if (diff === 0) {
    return 'DUE'
  }

  return 'UPCOMING'
}

export function getLatestLogByType(
  logs: CareLog[],
  type: CareLog['eventType'],
): CareLog | null {
  return (
    logs
      .filter((log) => log.eventType === type)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())[0] ??
    null
  )
}

import { differenceInCalendarDays, parseISO } from 'date-fns'

import type { CareEventType, CareLog } from '@/types/domain'

export function getLatestLogByType(logs: CareLog[] | undefined, type: CareEventType): CareLog | null {
  if (!logs?.length) {
    return null
  }

  return logs.find((log) => log.eventType === type) ?? null
}

export function getRepotElapsedDays(
  logs: CareLog[] | undefined,
  now = new Date(),
): number | null {
  const latestRepot = getLatestLogByType(logs, 'REPOT')
  if (!latestRepot) {
    return null
  }

  return differenceInCalendarDays(now, parseISO(latestRepot.occurredAt))
}

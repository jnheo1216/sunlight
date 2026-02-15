import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/features/queryKeys'
import { listCareEvents } from '@/services/scheduleService'
import type { ScheduleRange } from '@/types/domain'

export function useSchedule(range: ScheduleRange) {
  return useQuery({
    queryKey: queryKeys.schedule(range),
    queryFn: () => listCareEvents(range),
  })
}

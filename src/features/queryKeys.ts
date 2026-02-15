import type { ScheduleRange } from '@/types/domain'

export const queryKeys = {
  plants: ['plants'] as const,
  plant: (plantId: string) => ['plant', plantId] as const,
  logs: (plantId: string) => ['logs', plantId] as const,
  photos: (plantId: string) => ['photos', plantId] as const,
  latestCareSummaries: ['latest-care-summaries'] as const,
  schedule: (range: ScheduleRange) => ['schedule', range.from, range.to] as const,
}

import type { ScheduleRange } from '@/types/domain'

export const queryKeys = {
  plants: ['plants'] as const,
  plant: (plantId: string) => ['plant', plantId] as const,
  profile: (plantId: string) => ['profile', plantId] as const,
  logs: (plantId: string) => ['logs', plantId] as const,
  photos: (plantId: string) => ['photos', plantId] as const,
  schedule: (range: ScheduleRange) => ['schedule', range.from, range.to] as const,
  schedules: ['schedule', 'all'] as const,
}

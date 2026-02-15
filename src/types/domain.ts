export type CareEventType = 'WATER' | 'FERTILIZE' | 'REPOT'

export interface Plant {
  id: string
  name: string
  species: string | null
  location: string | null
  acquiredOn: string | null
  note: string | null
  nextRepotAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PlantPhoto {
  id: string
  plantId: string
  storagePath: string
  isCover: boolean
  capturedAt: string | null
  createdAt: string
}

export interface CareProfile {
  plantId: string
  wateringIntervalDays: number
  fertilizingIntervalDays: number
  nextWateringOverrideAt: string | null
  nextFertilizingOverrideAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CareLog {
  id: string
  plantId: string
  eventType: CareEventType
  occurredAt: string
  fertilizerName: string | null
  note: string | null
  createdAt: string
}

export interface PlantLatestCareSummary {
  plantId: string
  lastWateredAt: string | null
  lastFertilizedAt: string | null
  lastFertilizerName: string | null
  lastRepottedAt: string | null
}

export type ScheduleStatus = 'OVERDUE' | 'DUE' | 'UPCOMING' | 'UNSCHEDULED'

export interface CareSchedule {
  plantId: string
  plantName: string
  nextWateringAt: string | null
  nextFertilizingAt: string | null
  nextRepotAt: string | null
  wateringStatus: ScheduleStatus
  fertilizingStatus: ScheduleStatus
  repotStatus: ScheduleStatus
}

export interface CareScheduleEvent {
  id: string
  plantId: string
  plantName: string
  type: CareEventType
  startsAt: string
  fertilizerName: string | null
  note: string | null
}

export interface ScheduleRange {
  from: string
  to: string
}

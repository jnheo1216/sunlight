import { requireSupabase } from '@/lib/supabase'
import type {
  CareEventType,
  CareLog,
  PlantLatestCareSummary,
} from '@/types/domain'
import type { Database } from '@/types/supabase'

export interface CreateCareLogInput {
  eventType: CareEventType
  occurredAt: string
  fertilizerName?: string
  note?: string
}

function mapCareLog(row: Database['public']['Tables']['care_logs']['Row']): CareLog {
  return {
    id: row.id,
    plantId: row.plant_id,
    eventType: row.event_type,
    occurredAt: row.occurred_at,
    fertilizerName: row.fertilizer_name,
    note: row.note,
    createdAt: row.created_at,
  }
}

export async function listCareLogs(plantId: string): Promise<CareLog[]> {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('care_logs')
    .select('*')
    .eq('plant_id', plantId)
    .order('occurred_at', { ascending: false })

  if (error) {
    throw error
  }

  return data.map(mapCareLog)
}

export async function createCareLog(
  plantId: string,
  input: CreateCareLogInput,
): Promise<CareLog> {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('care_logs')
    .insert({
      plant_id: plantId,
      event_type: input.eventType,
      occurred_at: input.occurredAt,
      fertilizer_name:
        input.eventType === 'FERTILIZE' ? input.fertilizerName?.trim() || null : null,
      note: input.note || null,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapCareLog(data)
}

function createEmptySummary(plantId: string): PlantLatestCareSummary {
  return {
    plantId,
    lastWateredAt: null,
    lastFertilizedAt: null,
    lastFertilizerName: null,
    lastRepottedAt: null,
  }
}

export async function listLatestCareSummaries(): Promise<PlantLatestCareSummary[]> {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('care_logs')
    .select('plant_id, event_type, occurred_at, fertilizer_name')
    .order('occurred_at', { ascending: false })

  if (error) {
    throw error
  }

  const summaryMap = new Map<string, PlantLatestCareSummary>()

  for (const row of data) {
    const plantId = row.plant_id
    const existing = summaryMap.get(plantId) ?? createEmptySummary(plantId)

    if (row.event_type === 'WATER' && !existing.lastWateredAt) {
      existing.lastWateredAt = row.occurred_at
    }

    if (row.event_type === 'FERTILIZE' && !existing.lastFertilizedAt) {
      existing.lastFertilizedAt = row.occurred_at
      existing.lastFertilizerName = row.fertilizer_name
    }

    if (row.event_type === 'REPOT' && !existing.lastRepottedAt) {
      existing.lastRepottedAt = row.occurred_at
    }

    summaryMap.set(plantId, existing)
  }

  return [...summaryMap.values()]
}

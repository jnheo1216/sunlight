import { requireSupabase } from '@/lib/supabase'
import type { CareLog, CareProfile, CareEventType } from '@/types/domain'
import type { Database } from '@/types/supabase'

export interface UpsertCareProfileInput {
  wateringIntervalDays: number
  fertilizingIntervalDays: number
  nextWateringOverrideAt?: string
  nextFertilizingOverrideAt?: string
}

export interface CreateCareLogInput {
  eventType: CareEventType
  occurredAt: string
  note?: string
}

function mapCareProfile(row: Database['public']['Tables']['care_profiles']['Row']): CareProfile {
  return {
    plantId: row.plant_id,
    wateringIntervalDays: row.watering_interval_days,
    fertilizingIntervalDays: row.fertilizing_interval_days,
    nextWateringOverrideAt: row.next_watering_override_at,
    nextFertilizingOverrideAt: row.next_fertilizing_override_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapCareLog(row: Database['public']['Tables']['care_logs']['Row']): CareLog {
  return {
    id: row.id,
    plantId: row.plant_id,
    eventType: row.event_type,
    occurredAt: row.occurred_at,
    note: row.note,
    createdAt: row.created_at,
  }
}

export async function getCareProfile(plantId: string): Promise<CareProfile | null> {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('care_profiles')
    .select('*')
    .eq('plant_id', plantId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapCareProfile(data) : null
}

export async function upsertCareProfile(
  plantId: string,
  input: UpsertCareProfileInput,
): Promise<CareProfile> {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('care_profiles')
    .upsert(
      {
        plant_id: plantId,
        watering_interval_days: input.wateringIntervalDays,
        fertilizing_interval_days: input.fertilizingIntervalDays,
        next_watering_override_at: input.nextWateringOverrideAt || null,
        next_fertilizing_override_at: input.nextFertilizingOverrideAt || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'plant_id',
      },
    )
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapCareProfile(data)
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
      note: input.note || null,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  if (input.eventType === 'WATER') {
    const { error: profileError } = await supabase
      .from('care_profiles')
      .update({ next_watering_override_at: null, updated_at: new Date().toISOString() })
      .eq('plant_id', plantId)

    if (profileError) {
      throw profileError
    }
  }

  if (input.eventType === 'FERTILIZE') {
    const { error: profileError } = await supabase
      .from('care_profiles')
      .update({ next_fertilizing_override_at: null, updated_at: new Date().toISOString() })
      .eq('plant_id', plantId)

    if (profileError) {
      throw profileError
    }
  }

  return mapCareLog(data)
}

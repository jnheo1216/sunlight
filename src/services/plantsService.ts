import { requireSupabase } from '@/lib/supabase'
import type { Plant } from '@/types/domain'
import type { Database } from '@/types/supabase'

export interface UpsertPlantInput {
  name: string
  species?: string
  location?: string
  acquiredOn?: string
  note?: string
}

function mapPlant(row: Database['public']['Tables']['plants']['Row']): Plant {
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    location: row.location,
    acquiredOn: row.acquired_on,
    note: row.note,
    nextRepotAt: row.next_repot_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listPlants(): Promise<Plant[]> {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data.map(mapPlant)
}

export async function getPlantById(plantId: string): Promise<Plant | null> {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('id', plantId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? mapPlant(data) : null
}

export async function createPlant(input: UpsertPlantInput): Promise<Plant> {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('plants')
    .insert({
      name: input.name,
      species: input.species || null,
      location: input.location || null,
      acquired_on: input.acquiredOn || null,
      note: input.note || null,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapPlant(data)
}

export async function updatePlant(plantId: string, input: UpsertPlantInput): Promise<Plant> {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('plants')
    .update({
      name: input.name,
      species: input.species || null,
      location: input.location || null,
      acquired_on: input.acquiredOn || null,
      note: input.note || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', plantId)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapPlant(data)
}

export async function deletePlant(plantId: string): Promise<void> {
  const supabase = requireSupabase()
  const { error } = await supabase.from('plants').delete().eq('id', plantId)

  if (error) {
    throw error
  }
}

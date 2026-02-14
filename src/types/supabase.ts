export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      plants: {
        Row: {
          id: string
          name: string
          species: string | null
          location: string | null
          acquired_on: string | null
          note: string | null
          next_repot_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          species?: string | null
          location?: string | null
          acquired_on?: string | null
          note?: string | null
          next_repot_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          species?: string | null
          location?: string | null
          acquired_on?: string | null
          note?: string | null
          next_repot_at?: string | null
          updated_at?: string
        }
      }
      plant_photos: {
        Row: {
          id: string
          plant_id: string
          storage_path: string
          is_cover: boolean
          captured_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          plant_id: string
          storage_path: string
          is_cover?: boolean
          captured_at?: string | null
          created_at?: string
        }
        Update: {
          storage_path?: string
          is_cover?: boolean
          captured_at?: string | null
        }
      }
      care_profiles: {
        Row: {
          plant_id: string
          watering_interval_days: number
          fertilizing_interval_days: number
          next_watering_override_at: string | null
          next_fertilizing_override_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          plant_id: string
          watering_interval_days: number
          fertilizing_interval_days: number
          next_watering_override_at?: string | null
          next_fertilizing_override_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          watering_interval_days?: number
          fertilizing_interval_days?: number
          next_watering_override_at?: string | null
          next_fertilizing_override_at?: string | null
          updated_at?: string
        }
      }
      care_logs: {
        Row: {
          id: string
          plant_id: string
          event_type: 'WATER' | 'FERTILIZE' | 'REPOT'
          occurred_at: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          plant_id: string
          event_type: 'WATER' | 'FERTILIZE' | 'REPOT'
          occurred_at: string
          note?: string | null
          created_at?: string
        }
        Update: {
          occurred_at?: string
          note?: string | null
        }
      }
      v_care_schedule: {
        Row: {
          plant_id: string
          plant_name: string
          next_watering_at: string | null
          next_fertilizing_at: string | null
          next_repot_at: string | null
          watering_status: 'OVERDUE' | 'DUE' | 'UPCOMING' | 'UNSCHEDULED'
          fertilizing_status: 'OVERDUE' | 'DUE' | 'UPCOMING' | 'UNSCHEDULED'
          repot_status: 'OVERDUE' | 'DUE' | 'UPCOMING' | 'UNSCHEDULED'
        }
      }
    }
    Views: {
      v_care_schedule: {
        Row: {
          plant_id: string
          plant_name: string
          next_watering_at: string | null
          next_fertilizing_at: string | null
          next_repot_at: string | null
          watering_status: 'OVERDUE' | 'DUE' | 'UPCOMING' | 'UNSCHEDULED'
          fertilizing_status: 'OVERDUE' | 'DUE' | 'UPCOMING' | 'UNSCHEDULED'
          repot_status: 'OVERDUE' | 'DUE' | 'UPCOMING' | 'UNSCHEDULED'
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

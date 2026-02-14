import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/features/queryKeys'
import {
  createPlant,
  deletePlant,
  getPlantById,
  listPlants,
  updatePlant,
  type UpsertPlantInput,
} from '@/services/plantsService'

export function usePlants() {
  return useQuery({
    queryKey: queryKeys.plants,
    queryFn: listPlants,
  })
}

export function usePlant(plantId?: string) {
  return useQuery({
    queryKey: queryKeys.plant(plantId ?? ''),
    queryFn: () => getPlantById(plantId ?? ''),
    enabled: Boolean(plantId),
  })
}

export function useCreatePlant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpsertPlantInput) => createPlant(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.plants })
      void queryClient.invalidateQueries({ queryKey: queryKeys.schedules })
    },
  })
}

export function useUpdatePlant(plantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpsertPlantInput) => updatePlant(plantId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.plants })
      void queryClient.invalidateQueries({ queryKey: queryKeys.plant(plantId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.schedules })
    },
  })
}

export function useDeletePlant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (plantId: string) => deletePlant(plantId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.plants })
      void queryClient.invalidateQueries({ queryKey: queryKeys.schedules })
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/features/queryKeys'
import {
  createCareLog,
  getCareProfile,
  listCareLogs,
  upsertCareProfile,
  type CreateCareLogInput,
  type UpsertCareProfileInput,
} from '@/services/careService'
import {
  deletePhoto,
  listPlantPhotosWithUrls,
  setCoverPhoto,
  uploadPlantPhoto,
} from '@/services/photosService'

export function useCareProfile(plantId?: string) {
  return useQuery({
    queryKey: queryKeys.profile(plantId ?? ''),
    queryFn: () => getCareProfile(plantId ?? ''),
    enabled: Boolean(plantId),
  })
}

export function useUpsertCareProfile(plantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpsertCareProfileInput) => upsertCareProfile(plantId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile(plantId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.schedules })
    },
  })
}

export function useCareLogs(plantId?: string) {
  return useQuery({
    queryKey: queryKeys.logs(plantId ?? ''),
    queryFn: () => listCareLogs(plantId ?? ''),
    enabled: Boolean(plantId),
  })
}

export function useCreateCareLog(plantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCareLogInput) => createCareLog(plantId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.logs(plantId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile(plantId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.schedules })
    },
  })
}

export function usePlantPhotos(plantId?: string) {
  return useQuery({
    queryKey: queryKeys.photos(plantId ?? ''),
    queryFn: () => listPlantPhotosWithUrls(plantId ?? ''),
    enabled: Boolean(plantId),
  })
}

export function useUploadPlantPhoto(plantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { file: File; capturedAt?: string; isCover?: boolean }) =>
      uploadPlantPhoto({
        plantId,
        ...input,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.photos(plantId) })
    },
  })
}

export function useSetCoverPhoto(plantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (photoId: string) => setCoverPhoto(plantId, photoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.photos(plantId) })
    },
  })
}

export function useDeletePhoto(plantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (photoId: string) => deletePhoto(plantId, photoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.photos(plantId) })
    },
  })
}

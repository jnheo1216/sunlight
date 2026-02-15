import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/features/queryKeys'
import {
  createCareLog,
  listCareLogs,
  listLatestCareSummaries,
  type CreateCareLogInput,
} from '@/services/careService'
import {
  deletePhoto,
  listPlantPhotosWithUrls,
  setCoverPhoto,
  uploadPlantPhoto,
} from '@/services/photosService'

export function useCareLogs(plantId?: string) {
  return useQuery({
    queryKey: queryKeys.logs(plantId ?? ''),
    queryFn: () => listCareLogs(plantId ?? ''),
    enabled: Boolean(plantId),
  })
}

export function useLatestCareSummaries() {
  return useQuery({
    queryKey: queryKeys.latestCareSummaries,
    queryFn: listLatestCareSummaries,
  })
}

export function useCreateCareLog(plantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCareLogInput) => createCareLog(plantId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.logs(plantId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.latestCareSummaries })
      void queryClient.invalidateQueries({ queryKey: ['schedule'] })
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

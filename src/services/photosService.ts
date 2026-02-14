import { requireSupabase } from '@/lib/supabase'
import type { PlantPhoto } from '@/types/domain'
import type { Database } from '@/types/supabase'

const BUCKET = 'plant-images'

export interface PlantPhotoWithUrl extends PlantPhoto {
  signedUrl: string | null
}

function mapPhoto(row: Database['public']['Tables']['plant_photos']['Row']): PlantPhoto {
  return {
    id: row.id,
    plantId: row.plant_id,
    storagePath: row.storage_path,
    isCover: row.is_cover,
    capturedAt: row.captured_at,
    createdAt: row.created_at,
  }
}

async function toWebpBlob(file: File): Promise<Blob> {
  const imageBitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = imageBitmap.width
  canvas.height = imageBitmap.height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('이미지 처리에 실패했습니다.')
  }

  context.drawImage(imageBitmap, 0, 0)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('WEBP 변환에 실패했습니다.'))
          return
        }

        resolve(blob)
      },
      'image/webp',
      0.85,
    )
  })
}

function createPublicUrl(path: string): string {
  const supabase = requireSupabase()
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function listPlantPhotos(plantId: string): Promise<PlantPhoto[]> {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('plant_photos')
    .select('*')
    .eq('plant_id', plantId)
    .order('is_cover', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data.map(mapPhoto)
}

export async function listPlantPhotosWithUrls(
  plantId: string,
): Promise<PlantPhotoWithUrl[]> {
  const photos = await listPlantPhotos(plantId)
  const withUrl = photos.map((photo) => ({
    ...photo,
    signedUrl: createPublicUrl(photo.storagePath),
  }))

  return withUrl
}

export async function uploadPlantPhoto(options: {
  plantId: string
  file: File
  capturedAt?: string
  isCover?: boolean
}): Promise<PlantPhoto> {
  const supabase = requireSupabase()

  const blob = await toWebpBlob(options.file)
  const fileId = crypto.randomUUID()
  const path = `${options.plantId}/${fileId}.webp`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: 'image/webp',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data, error } = await supabase
    .from('plant_photos')
    .insert({
      plant_id: options.plantId,
      storage_path: path,
      is_cover: Boolean(options.isCover),
      captured_at: options.capturedAt || null,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  if (options.isCover) {
    await setCoverPhoto(options.plantId, data.id)
  }

  return mapPhoto(data)
}

export async function setCoverPhoto(plantId: string, photoId: string): Promise<void> {
  const supabase = requireSupabase()

  const { error: resetError } = await supabase
    .from('plant_photos')
    .update({ is_cover: false })
    .eq('plant_id', plantId)

  if (resetError) {
    throw resetError
  }

  const { error } = await supabase
    .from('plant_photos')
    .update({ is_cover: true })
    .eq('id', photoId)
    .eq('plant_id', plantId)

  if (error) {
    throw error
  }
}

export async function deletePhoto(plantId: string, photoId: string): Promise<void> {
  const supabase = requireSupabase()

  const { data: photo, error: photoError } = await supabase
    .from('plant_photos')
    .select('*')
    .eq('plant_id', plantId)
    .eq('id', photoId)
    .single()

  if (photoError) {
    throw photoError
  }

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([photo.storage_path])

  if (storageError) {
    throw storageError
  }

  const { error } = await supabase
    .from('plant_photos')
    .delete()
    .eq('id', photoId)
    .eq('plant_id', plantId)

  if (error) {
    throw error
  }
}

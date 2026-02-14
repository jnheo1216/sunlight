import { useState } from 'react'
import { ImagePlus, Star, Trash2 } from 'lucide-react'

import {
  useDeletePhoto,
  usePlantPhotos,
  useSetCoverPhoto,
  useUploadPlantPhoto,
} from '@/features/care/api/useCare'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/components/ui'
import { toDateInputValue } from '@/lib/utils'

interface PhotoUploaderProps {
  plantId: string
}

export function PhotoUploader({ plantId }: PhotoUploaderProps) {
  const { data: photos, isLoading } = usePlantPhotos(plantId)
  const uploadMutation = useUploadPlantPhoto(plantId)
  const setCoverMutation = useSetCoverPhoto(plantId)
  const deleteMutation = useDeletePhoto(plantId)

  const [file, setFile] = useState<File | null>(null)
  const [capturedAt, setCapturedAt] = useState(toDateInputValue(new Date()))
  const [isCover, setIsCover] = useState(false)

  const handleUpload = async () => {
    if (!file) {
      return
    }

    await uploadMutation.mutateAsync({
      file,
      capturedAt: capturedAt || undefined,
      isCover,
    })

    setFile(null)
    setIsCover(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>사진 갤러리</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid gap-3 md:grid-cols-[1fr,180px,auto]'>
          <div className='space-y-2'>
            <Label htmlFor='photo'>이미지 선택</Label>
            <Input
              id='photo'
              type='file'
              accept='image/*'
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='capturedAt'>촬영일</Label>
            <Input
              id='capturedAt'
              type='date'
              value={capturedAt}
              onChange={(event) => setCapturedAt(event.target.value)}
            />
          </div>
          <div className='flex items-end gap-2'>
            <label className='inline-flex items-center gap-2 text-sm text-[var(--color-fg-muted)]'>
              <input
                type='checkbox'
                checked={isCover}
                onChange={(event) => setIsCover(event.target.checked)}
              />
              대표
            </label>
            <Button
              className='w-full'
              onClick={handleUpload}
              disabled={!file || uploadMutation.isPending}
            >
              <ImagePlus className='h-4 w-4' />
              업로드
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className='text-sm text-[var(--color-fg-muted)]'>로딩 중...</p>
        ) : null}

        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {photos?.map((photo) => (
            <div
              key={photo.id}
              className='overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]'
            >
              <div className='aspect-[4/3] bg-[var(--color-surface)]'>
                {photo.signedUrl ? (
                  <img
                    src={photo.signedUrl}
                    alt='식물 사진'
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='grid h-full place-items-center text-xs text-[var(--color-fg-muted)]'>
                    미리보기 없음
                  </div>
                )}
              </div>
              <div className='flex items-center justify-between p-2'>
                <Button
                  variant={photo.isCover ? 'secondary' : 'ghost'}
                  size='sm'
                  disabled={setCoverMutation.isPending}
                  onClick={() => setCoverMutation.mutate(photo.id)}
                >
                  <Star className='h-3.5 w-3.5' />
                  {photo.isCover ? '대표' : '대표 지정'}
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(photo.id)}
                >
                  <Trash2 className='h-4 w-4 text-[var(--color-danger)]' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

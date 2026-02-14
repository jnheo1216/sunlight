import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { CareLogComposer } from '@/components/plant/CareLogComposer'
import { PhotoUploader } from '@/components/plant/PhotoUploader'
import { ScheduleSummary } from '@/components/plant/ScheduleSummary'
import { Button, Card, CardContent, CardHeader, CardTitle, DatePicker, Input, Label } from '@/components/ui'
import {
  useCareLogs,
  useCareProfile,
  useUpsertCareProfile,
} from '@/features/care/api/useCare'
import {
  useDeletePlant,
  usePlant,
} from '@/features/plants/api/usePlants'
import { useSchedules } from '@/features/schedule/api/useSchedule'
import { careProfileSchema, type CareProfileFormValues } from '@/schemas/careProfileSchema'
import { formatDateTime, toDateInputValue } from '@/lib/utils'

export function PlantDetailPage() {
  const { plantId } = useParams<{ plantId: string }>()
  const navigate = useNavigate()

  const { data: plant, isLoading, error } = usePlant(plantId)
  const { data: profile } = useCareProfile(plantId)
  const { data: logs } = useCareLogs(plantId)
  const { data: schedules } = useSchedules()

  const upsertProfile = useUpsertCareProfile(plantId ?? '')
  const deletePlant = useDeletePlant()

  const schedule = useMemo(
    () => schedules?.find((item) => item.plantId === plantId),
    [schedules, plantId],
  )

  const form = useForm<CareProfileFormValues>({
    resolver: zodResolver(careProfileSchema),
    values: {
      wateringIntervalDays: profile?.wateringIntervalDays ?? 7,
      fertilizingIntervalDays: profile?.fertilizingIntervalDays ?? 30,
      nextWateringOverrideAt: toDateInputValue(profile?.nextWateringOverrideAt),
      nextFertilizingOverrideAt: toDateInputValue(profile?.nextFertilizingOverrideAt),
    },
  })

  if (!plantId) {
    return <p className='text-sm text-[var(--color-danger)]'>잘못된 접근입니다.</p>
  }

  if (isLoading) {
    return <p className='text-sm text-[var(--color-fg-muted)]'>식물 정보를 불러오는 중...</p>
  }

  if (error || !plant) {
    return <p className='text-sm text-[var(--color-danger)]'>식물 정보를 찾지 못했습니다.</p>
  }

  const onSubmitProfile = form.handleSubmit(async (values) => {
    await upsertProfile.mutateAsync({
      wateringIntervalDays: values.wateringIntervalDays,
      fertilizingIntervalDays: values.fertilizingIntervalDays,
      nextWateringOverrideAt: values.nextWateringOverrideAt
        ? new Date(values.nextWateringOverrideAt).toISOString()
        : undefined,
      nextFertilizingOverrideAt: values.nextFertilizingOverrideAt
        ? new Date(values.nextFertilizingOverrideAt).toISOString()
        : undefined,
    })
  })

  const handleDeletePlant = async () => {
    if (!window.confirm('정말 삭제하시겠습니까? 관련 이력도 함께 제거됩니다.')) {
      return
    }

    await deletePlant.mutateAsync(plant.id)
    navigate('/plants')
  }

  return (
    <div className='space-y-5'>
      <Card>
        <CardHeader className='flex-row items-center justify-between'>
          <div>
            <CardTitle>{plant.name}</CardTitle>
            <p className='text-sm text-[var(--color-fg-muted)]'>
              {plant.species || '종류 미입력'} · {plant.location || '위치 미입력'}
            </p>
          </div>
          <div className='flex gap-2'>
            <Button asChild variant='outline'>
              <Link to={`/plants/${plant.id}/edit`}>수정</Link>
            </Button>
            <Button variant='danger' onClick={handleDeletePlant}>
              삭제
            </Button>
          </div>
        </CardHeader>
      </Card>

      <ScheduleSummary schedule={schedule} />

      <Card>
        <CardHeader>
          <CardTitle>주기 설정 및 수동 보정</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='grid gap-3 md:grid-cols-2' onSubmit={onSubmitProfile}>
            <div className='space-y-2'>
              <Label htmlFor='wateringIntervalDays'>물 주기 (일)</Label>
              <Input
                id='wateringIntervalDays'
                type='number'
                {...form.register('wateringIntervalDays', { valueAsNumber: true })}
              />
              {form.formState.errors.wateringIntervalDays ? (
                <p className='text-xs text-[var(--color-danger)]'>
                  {form.formState.errors.wateringIntervalDays.message}
                </p>
              ) : null}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='fertilizingIntervalDays'>비료 주기 (일)</Label>
              <Input
                id='fertilizingIntervalDays'
                type='number'
                {...form.register('fertilizingIntervalDays', { valueAsNumber: true })}
              />
              {form.formState.errors.fertilizingIntervalDays ? (
                <p className='text-xs text-[var(--color-danger)]'>
                  {form.formState.errors.fertilizingIntervalDays.message}
                </p>
              ) : null}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='nextWateringOverrideAt'>다음 물 주기 수동 지정</Label>
              <DatePicker id='nextWateringOverrideAt' {...form.register('nextWateringOverrideAt')} />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='nextFertilizingOverrideAt'>다음 비료 주기 수동 지정</Label>
              <DatePicker id='nextFertilizingOverrideAt' {...form.register('nextFertilizingOverrideAt')} />
            </div>

            <div className='md:col-span-2'>
              <Button type='submit' disabled={upsertProfile.isPending}>
                {upsertProfile.isPending ? '저장 중...' : '주기 설정 저장'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PhotoUploader plantId={plant.id} />
      <CareLogComposer plantId={plant.id} />

      <Card>
        <CardHeader>
          <CardTitle>이력 타임라인</CardTitle>
        </CardHeader>
        <CardContent>
          {logs?.length ? (
            <div className='space-y-2'>
              {logs.map((log) => (
                <div
                  key={log.id}
                  className='rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3'
                >
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-semibold'>{log.eventType}</p>
                    <p className='text-xs text-[var(--color-fg-muted)]'>
                      {formatDateTime(log.occurredAt)}
                    </p>
                  </div>
                  {log.note ? <p className='mt-1 text-sm text-[var(--color-fg-muted)]'>{log.note}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className='text-sm text-[var(--color-fg-muted)]'>기록된 케어 이력이 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

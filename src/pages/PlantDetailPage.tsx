import { Link, useNavigate, useParams } from 'react-router-dom'

import { CareLogComposer } from '@/components/plant/CareLogComposer'
import { PhotoUploader } from '@/components/plant/PhotoUploader'
import { PlantCareHistoryCalendar } from '@/components/plant/PlantCareHistoryCalendar'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useCareLogs } from '@/features/care/api/useCare'
import { useDeletePlant, usePlant } from '@/features/plants/api/usePlants'
import { formatDateTime } from '@/lib/utils'
import { getLatestLogByType, getRepotElapsedDays } from '@/services/careInsights'

export function PlantDetailPage() {
  const { plantId } = useParams<{ plantId: string }>()
  const navigate = useNavigate()

  const { data: plant, isLoading, error } = usePlant(plantId)
  const { data: logs } = useCareLogs(plantId)

  const deletePlant = useDeletePlant()

  if (!plantId) {
    return <p className='text-sm text-[var(--color-danger)]'>잘못된 접근입니다.</p>
  }

  if (isLoading) {
    return <p className='text-sm text-[var(--color-fg-muted)]'>식물 정보를 불러오는 중...</p>
  }

  if (error || !plant) {
    return <p className='text-sm text-[var(--color-danger)]'>식물 정보를 찾지 못했습니다.</p>
  }

  const latestWaterLog = getLatestLogByType(logs, 'WATER')
  const latestFertilizeLog = getLatestLogByType(logs, 'FERTILIZE')
  const latestRepotLog = getLatestLogByType(logs, 'REPOT')
  const repotElapsedDays = getRepotElapsedDays(logs)

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

      <Card>
        <CardHeader>
          <CardTitle>케어 인사이트</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3'>
            <p className='text-xs text-[var(--color-fg-muted)]'>최근 물 준 날</p>
            <p className='mt-1 text-sm font-semibold'>
              {latestWaterLog ? formatDateTime(latestWaterLog.occurredAt) : '기록 없음'}
            </p>
          </div>

          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3'>
            <p className='text-xs text-[var(--color-fg-muted)]'>최근 비료 준 날</p>
            <p className='mt-1 text-sm font-semibold'>
              {latestFertilizeLog ? formatDateTime(latestFertilizeLog.occurredAt) : '기록 없음'}
            </p>
            <p className='text-xs text-[var(--color-fg-muted)]'>
              {latestFertilizeLog?.fertilizerName ?? '-'}
            </p>
          </div>

          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3'>
            <p className='text-xs text-[var(--color-fg-muted)]'>최근 분갈이</p>
            <p className='mt-1 text-sm font-semibold'>
              {latestRepotLog ? formatDateTime(latestRepotLog.occurredAt) : '기록 없음'}
            </p>
          </div>

          <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3'>
            <p className='text-xs text-[var(--color-fg-muted)]'>분갈이 경과일</p>
            <p className='mt-1 text-sm font-semibold'>
              {repotElapsedDays === null ? '분갈이 기록 없음' : `${repotElapsedDays}일 경과`}
            </p>
          </div>
        </CardContent>
      </Card>

      <PlantCareHistoryCalendar logs={logs ?? []} />

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
                    <p className='text-sm font-semibold'>
                      {log.eventType}
                      {log.eventType === 'FERTILIZE' && log.fertilizerName
                        ? ` · ${log.fertilizerName}`
                        : ''}
                    </p>
                    <p className='text-xs text-[var(--color-fg-muted)]'>
                      {formatDateTime(log.occurredAt)}
                    </p>
                  </div>
                  {log.note ? (
                    <p className='mt-1 text-sm text-[var(--color-fg-muted)]'>{log.note}</p>
                  ) : null}
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

import { describe, expect, it } from 'vitest'

import { getLatestLogByType, getRepotElapsedDays } from '@/services/careInsights'
import type { CareLog } from '@/types/domain'

const logs: CareLog[] = [
  {
    id: '1',
    plantId: 'p1',
    eventType: 'WATER',
    occurredAt: '2026-02-01T10:00:00.000Z',
    fertilizerName: null,
    note: null,
    createdAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: '2',
    plantId: 'p1',
    eventType: 'FERTILIZE',
    occurredAt: '2026-02-03T10:00:00.000Z',
    fertilizerName: '액비A',
    note: null,
    createdAt: '2026-02-03T10:00:00.000Z',
  },
  {
    id: '3',
    plantId: 'p1',
    eventType: 'REPOT',
    occurredAt: '2026-02-05T10:00:00.000Z',
    fertilizerName: null,
    note: null,
    createdAt: '2026-02-05T10:00:00.000Z',
  },
]

describe('careInsights', () => {
  it('타입별 최근 로그를 조회한다', () => {
    expect(getLatestLogByType(logs, 'FERTILIZE')?.id).toBe('2')
  })

  it('분갈이 로그 기준 경과일을 계산한다', () => {
    const elapsed = getRepotElapsedDays(logs, new Date('2026-02-10T10:00:00.000Z'))
    expect(elapsed).toBe(5)
  })

  it('분갈이 로그가 없으면 null을 반환한다', () => {
    const elapsed = getRepotElapsedDays(
      logs.filter((log) => log.eventType !== 'REPOT'),
      new Date('2026-02-10T10:00:00.000Z'),
    )

    expect(elapsed).toBeNull()
  })
})

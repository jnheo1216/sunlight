import { describe, expect, it } from 'vitest'

import { calculateNextCareAt, getScheduleStatus } from '@/services/scheduleCalculator'

describe('scheduleCalculator', () => {
  it('override가 존재하면 override 날짜를 우선 사용한다', () => {
    const next = calculateNextCareAt({
      intervalDays: 7,
      lastOccurredAt: '2026-01-10T00:00:00.000Z',
      overrideAt: '2026-01-12T00:00:00.000Z',
      fallbackFrom: '2026-01-01T00:00:00.000Z',
    })

    expect(next).toBe('2026-01-12T00:00:00.000Z')
  })

  it('마지막 로그 기준으로 interval을 더해 다음 예정일을 계산한다', () => {
    const next = calculateNextCareAt({
      intervalDays: 5,
      lastOccurredAt: '2026-01-10T00:00:00.000Z',
      overrideAt: null,
      fallbackFrom: '2026-01-01T00:00:00.000Z',
    })

    expect(next).toBe('2026-01-15T00:00:00.000Z')
  })

  it('로그가 없으면 생성일 기준으로 interval을 더한다', () => {
    const next = calculateNextCareAt({
      intervalDays: 10,
      lastOccurredAt: null,
      overrideAt: null,
      fallbackFrom: '2026-01-01T00:00:00.000Z',
    })

    expect(next).toBe('2026-01-11T00:00:00.000Z')
  })

  it('상태를 overdue/due/upcoming으로 분류한다', () => {
    expect(getScheduleStatus('2026-01-01T00:00:00.000Z', new Date('2026-01-03T00:00:00.000Z'))).toBe(
      'OVERDUE',
    )
    expect(getScheduleStatus('2026-01-03T10:00:00.000Z', new Date('2026-01-03T01:00:00.000Z'))).toBe(
      'DUE',
    )
    expect(getScheduleStatus('2026-01-05T00:00:00.000Z', new Date('2026-01-03T00:00:00.000Z'))).toBe(
      'UPCOMING',
    )
  })
})

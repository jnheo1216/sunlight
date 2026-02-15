import { describe, expect, it } from 'vitest'

import { careLogSchema } from '@/schemas/careLogSchema'

describe('careLogSchema', () => {
  it('비료 기록은 비료명이 필수다', () => {
    const result = careLogSchema.safeParse({
      eventType: 'FERTILIZE',
      occurredAt: '2026-02-10T10:00',
      fertilizerName: '',
      note: '',
    })

    expect(result.success).toBe(false)
  })

  it('비료명이 있으면 비료 기록을 통과한다', () => {
    const result = careLogSchema.safeParse({
      eventType: 'FERTILIZE',
      occurredAt: '2026-02-10T10:00',
      fertilizerName: '완효성 알비료',
      note: '',
    })

    expect(result.success).toBe(true)
  })

  it('물 기록은 비료명 없이 통과한다', () => {
    const result = careLogSchema.safeParse({
      eventType: 'WATER',
      occurredAt: '2026-02-10T10:00',
      note: '',
    })

    expect(result.success).toBe(true)
  })
})

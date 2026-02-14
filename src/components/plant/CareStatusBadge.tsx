import { Badge } from '@/components/ui'
import type { ScheduleStatus } from '@/types/domain'

const statusMeta: Record<
  ScheduleStatus,
  { label: string; variant: 'secondary' | 'warning' | 'danger' | 'success' }
> = {
  UNSCHEDULED: { label: '일정 없음', variant: 'secondary' },
  UPCOMING: { label: '예정', variant: 'success' },
  DUE: { label: '오늘', variant: 'warning' },
  OVERDUE: { label: '지연', variant: 'danger' },
}

interface CareStatusBadgeProps {
  status: ScheduleStatus
}

export function CareStatusBadge({ status }: CareStatusBadgeProps) {
  const meta = statusMeta[status]

  return <Badge variant={meta.variant}>{meta.label}</Badge>
}

import { Tabs, TabsList, TabsTrigger } from '@/components/ui'

export type CalendarFilterType = 'ALL' | 'WATER' | 'FERTILIZE' | 'REPOT'
export type CalendarFilterState = 'ALL' | 'PLANNED' | 'COMPLETED'

interface CalendarFiltersProps {
  type: CalendarFilterType
  state: CalendarFilterState
  onTypeChange: (value: CalendarFilterType) => void
  onStateChange: (value: CalendarFilterState) => void
}

export function CalendarFilters({
  type,
  state,
  onTypeChange,
  onStateChange,
}: CalendarFiltersProps) {
  return (
    <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
      <Tabs value={type} onValueChange={(value) => onTypeChange(value as CalendarFilterType)}>
        <TabsList>
          <TabsTrigger value='ALL'>전체</TabsTrigger>
          <TabsTrigger value='WATER'>물</TabsTrigger>
          <TabsTrigger value='FERTILIZE'>비료</TabsTrigger>
          <TabsTrigger value='REPOT'>분갈이</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs value={state} onValueChange={(value) => onStateChange(value as CalendarFilterState)}>
        <TabsList>
          <TabsTrigger value='ALL'>전체 상태</TabsTrigger>
          <TabsTrigger value='PLANNED'>예정</TabsTrigger>
          <TabsTrigger value='COMPLETED'>완료</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

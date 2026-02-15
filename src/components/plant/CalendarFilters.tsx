import { Tabs, TabsList, TabsTrigger } from '@/components/ui'

export type CalendarFilterType = 'ALL' | 'WATER' | 'FERTILIZE' | 'REPOT'

interface CalendarFiltersProps {
  type: CalendarFilterType
  onTypeChange: (value: CalendarFilterType) => void
}

export function CalendarFilters({ type, onTypeChange }: CalendarFiltersProps) {
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
    </div>
  )
}

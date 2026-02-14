import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

import { PlantCard } from '@/components/plant/PlantCard'
import { Button, Card, CardContent, Input } from '@/components/ui'
import { usePlants } from '@/features/plants/api/usePlants'
import { useSchedules } from '@/features/schedule/api/useSchedule'

export function PlantsPage() {
  const { data: plants, isLoading, error } = usePlants()
  const { data: schedules } = useSchedules()
  const [query, setQuery] = useState('')

  const filteredPlants = useMemo(() => {
    const source = plants ?? []

    if (!query.trim()) {
      return source
    }

    const normalized = query.trim().toLowerCase()
    return source.filter((plant) => {
      return (
        plant.name.toLowerCase().includes(normalized) ||
        (plant.species ?? '').toLowerCase().includes(normalized) ||
        (plant.location ?? '').toLowerCase().includes(normalized)
      )
    })
  }, [plants, query])

  if (isLoading) {
    return <p className='text-sm text-[var(--color-fg-muted)]'>식물 목록 로딩 중...</p>
  }

  if (error) {
    return <p className='text-sm text-[var(--color-danger)]'>식물 목록을 불러오지 못했습니다.</p>
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardContent className='flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between'>
          <div className='relative w-full md:max-w-sm'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-muted)]' />
            <Input
              className='pl-9'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='이름, 종류, 위치 검색'
            />
          </div>
          <Button asChild>
            <Link to='/plants/new'>새 식물 등록</Link>
          </Button>
        </CardContent>
      </Card>

      {filteredPlants.length === 0 ? (
        <Card>
          <CardContent className='p-6 text-sm text-[var(--color-fg-muted)]'>
            등록된 식물이 없습니다.
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {filteredPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              schedule={schedules?.find((item) => item.plantId === plant.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

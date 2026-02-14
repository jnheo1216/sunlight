import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { Button, Card, CardContent, CardHeader, CardTitle, DatePicker, Input, Label, Textarea } from '@/components/ui'
import {
  useCreatePlant,
  usePlant,
  useUpdatePlant,
} from '@/features/plants/api/usePlants'
import { plantFormSchema, type PlantFormValues } from '@/schemas/plantFormSchema'
import { toDateInputValue } from '@/lib/utils'

export function PlantFormPage() {
  const { plantId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(plantId)

  const createMutation = useCreatePlant()
  const updateMutation = useUpdatePlant(plantId ?? '')
  const { data: plant, isLoading } = usePlant(plantId)

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      name: '',
      species: '',
      location: '',
      acquiredOn: '',
      note: '',
      nextRepotAt: '',
    },
  })

  useEffect(() => {
    if (!plant) {
      return
    }

    form.reset({
      name: plant.name,
      species: plant.species ?? '',
      location: plant.location ?? '',
      acquiredOn: toDateInputValue(plant.acquiredOn),
      note: plant.note ?? '',
      nextRepotAt: toDateInputValue(plant.nextRepotAt),
    })
  }, [form, plant])

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      species: values.species,
      location: values.location,
      acquiredOn: values.acquiredOn,
      note: values.note,
      nextRepotAt: values.nextRepotAt,
    }

    if (isEdit && plantId) {
      await updateMutation.mutateAsync(payload)
      navigate(`/plants/${plantId}`)
      return
    }

    const created = await createMutation.mutateAsync(payload)
    navigate(`/plants/${created.id}`)
  })

  if (isEdit && isLoading) {
    return <p className='text-sm text-[var(--color-fg-muted)]'>식물 정보를 불러오는 중...</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? '식물 정보 수정' : '새 식물 등록'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className='grid gap-4 md:grid-cols-2' onSubmit={onSubmit}>
          <div className='space-y-2'>
            <Label htmlFor='name'>이름 *</Label>
            <Input id='name' {...form.register('name')} placeholder='예: 몬스테라' />
            {form.formState.errors.name ? (
              <p className='text-xs text-[var(--color-danger)]'>
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='species'>종류</Label>
            <Input id='species' {...form.register('species')} placeholder='예: Monstera deliciosa' />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='location'>위치</Label>
            <Input id='location' {...form.register('location')} placeholder='예: 거실 창가' />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='acquiredOn'>데려온 날짜</Label>
            <DatePicker id='acquiredOn' {...form.register('acquiredOn')} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='nextRepotAt'>다음 분갈이 예정일</Label>
            <DatePicker id='nextRepotAt' {...form.register('nextRepotAt')} />
          </div>

          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='note'>메모</Label>
            <Textarea id='note' {...form.register('note')} placeholder='관리 팁, 상태 변화 등을 기록하세요.' />
          </div>

          <div className='md:col-span-2 flex items-center gap-2'>
            <Button type='submit' disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? '저장 중...'
                : isEdit
                  ? '수정 저장'
                  : '등록 완료'}
            </Button>
            <Button type='button' variant='ghost' onClick={() => navigate(-1)}>
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

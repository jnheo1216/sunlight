import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useCreateCareLog } from '@/features/care/api/useCare'
import { careLogSchema, type CareLogFormValues } from '@/schemas/careLogSchema'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'

interface CareLogComposerProps {
  plantId: string
}

export function CareLogComposer({ plantId }: CareLogComposerProps) {
  const mutation = useCreateCareLog(plantId)
  const [eventType, setEventType] = useState<CareLogFormValues['eventType']>('WATER')
  const form = useForm<CareLogFormValues>({
    resolver: zodResolver(careLogSchema),
    defaultValues: {
      eventType: 'WATER',
      occurredAt: new Date().toISOString().slice(0, 16),
      note: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({
      eventType: values.eventType,
      occurredAt: new Date(values.occurredAt).toISOString(),
      note: values.note,
    })

    form.reset({
      eventType: values.eventType,
      occurredAt: new Date().toISOString().slice(0, 16),
      note: '',
    })
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>케어 이력 기록</CardTitle>
      </CardHeader>
      <CardContent>
        <form className='grid gap-3 sm:grid-cols-2' onSubmit={onSubmit}>
          <div className='space-y-2'>
            <Label htmlFor='eventType'>작업 타입</Label>
            <Select
              value={eventType}
              onValueChange={(value) => {
                const nextValue = value as CareLogFormValues['eventType']
                setEventType(nextValue)
                form.setValue('eventType', nextValue, { shouldValidate: true })
              }}
            >
              <SelectTrigger id='eventType'>
                <SelectValue placeholder='작업 선택' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='WATER'>물 주기</SelectItem>
                <SelectItem value='FERTILIZE'>비료 주기</SelectItem>
                <SelectItem value='REPOT'>분갈이</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.eventType ? (
              <p className='text-xs text-[var(--color-danger)]'>
                {form.formState.errors.eventType.message}
              </p>
            ) : null}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='occurredAt'>작업 일시</Label>
            <Input
              id='occurredAt'
              type='datetime-local'
              {...form.register('occurredAt')}
            />
            {form.formState.errors.occurredAt ? (
              <p className='text-xs text-[var(--color-danger)]'>
                {form.formState.errors.occurredAt.message}
              </p>
            ) : null}
          </div>

          <div className='space-y-2 sm:col-span-2'>
            <Label htmlFor='note'>메모</Label>
            <Textarea id='note' placeholder='예: 흙 상태가 건조해서 물을 더 줌' {...form.register('note')} />
          </div>

          <div className='sm:col-span-2'>
            <Button disabled={mutation.isPending} type='submit'>
              {mutation.isPending ? '기록 중...' : '기록 저장'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

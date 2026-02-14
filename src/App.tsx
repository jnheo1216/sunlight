import { Navigate, Route, Routes } from 'react-router-dom'

import { isSupabaseConfigured } from '@/lib/supabase'
import { AppShell } from '@/layouts/AppShell'
import { CalendarPage } from '@/pages/CalendarPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PlantDetailPage } from '@/pages/PlantDetailPage'
import { PlantFormPage } from '@/pages/PlantFormPage'
import { PlantsPage } from '@/pages/PlantsPage'

function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className='grid min-h-screen place-items-center p-6'>
        <div className='w-full max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]'>
          <h2 className='mb-2 text-lg font-semibold'>환경 설정이 필요합니다.</h2>
          <p className='mb-3 text-sm text-[var(--color-fg-muted)]'>
            Supabase 연결 정보가 필요합니다.
          </p>
          <pre className='overflow-x-auto rounded-lg bg-[var(--color-surface-muted)] p-3 text-xs'>
{`VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...`}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/plants' element={<PlantsPage />} />
        <Route path='/plants/new' element={<PlantFormPage />} />
        <Route path='/plants/:plantId' element={<PlantDetailPage />} />
        <Route path='/plants/:plantId/edit' element={<PlantFormPage />} />
        <Route path='/calendar' element={<CalendarPage />} />
      </Route>
      <Route path='/404' element={<NotFoundPage />} />
      <Route path='*' element={<Navigate to='/404' replace />} />
    </Routes>
  )
}

export default App

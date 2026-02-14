import { Link } from 'react-router-dom'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

export function NotFoundPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>페이지를 찾을 수 없습니다.</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to='/'>대시보드로 이동</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

# Sunlight - 식물 관리 웹앱 MVP

React + Vite + TypeScript + Tailwind v4 + Supabase 기반 식물 관리 앱입니다.

## 주요 기능

- 식물 등록/수정/삭제
- 사진 업로드(대표 이미지 + 갤러리)
- 물 주기/비료 주기/분갈이 이력 관리
- 물/비료 다음 예정일 자동 계산 + 수동 보정
- 월간/주간/리스트 캘린더
- 인증/로그인 없이 바로 사용 (Supabase anon role 권한 기반)

## 실행

```bash
npm install
cp .env.example .env
# .env에 Supabase 값 입력
npm run dev
```

## 테스트

```bash
npm run test:run
```

## Supabase

마이그레이션 파일:

- `supabase/migrations/20260214153000_init.sql`
- `supabase/migrations/20260214154500_remove_auth.sql`
- `supabase/migrations/20260214170000_fix_storage_final.sql` (Storage 정책 canonical 패치)

참고:
- `supabase/migrations/20260214161000_fix_storage_403.sql`
- `supabase/migrations/20260214162000_reset_storage_policies.sql`
위 2개는 deprecated(no-op)로 유지됩니다.

적용 후 별도 로그인 설정 없이 바로 사용 가능합니다.

### Storage 403 진단

```bash
./scripts/diagnose-storage-403.sh
```

개발 서버를 켠 상태에서 `.env`를 변경했다면 반드시 서버를 재시작해야 반영됩니다.

## 스택

- React 19 + Vite
- TypeScript
- Tailwind CSS v4
- Radix UI + shadcn 패턴
- TanStack Query
- React Hook Form + Zod
- FullCalendar
- Supabase (DB + Storage + Auth)

# Sunlight - 식물 관리 웹앱 MVP

React + Vite + TypeScript + Tailwind v4 + Supabase 기반 식물 관리 앱입니다.

## 주요 기능

- 식물 등록/수정/삭제
- 사진 업로드(대표 이미지 + 갤러리)
- 물/비료/분갈이 수동 이력 기록
- 비료 기록 시 비료 이름(자유 입력) 관리
- 식물 상세 이력 달력(물/비료/분갈이)
- 분갈이 경과일 표시(최근 분갈이 기록 기준)
- 월간/리스트 기록 캘린더
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

## Vercel 배포

### 프로젝트 설정

- Framework Preset: `Vite`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js: `20.x` 또는 `22.x`로 고정

`vercel.json`에 SPA 리라이트가 포함되어 있어 `/plants/...` 같은 직접 URL 접근도 동작합니다.

### 환경 변수

Vercel의 `Production`과 `Preview` 모두에 아래 값을 등록하세요.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

로컬 `.env`는 Git에 커밋하지 않습니다.

### 배포 후 체크리스트

- `/` 로딩
- `/plants`, `/calendar`, `/plants/<id>` 직접 URL 진입/새로고침
- 식물 CRUD, 케어 로그 생성, 상세 달력 렌더링
- 사진 업로드(네트워크/VPN 이슈 없는 환경에서 재확인)

## Supabase

마이그레이션 파일:

- `supabase/migrations/20260214153000_init.sql`
- `supabase/migrations/20260214154500_remove_auth.sql`
- `supabase/migrations/20260214170000_fix_storage_final.sql` (Storage 정책 canonical 패치)
- `supabase/migrations/20260214191000_manual_care_model.sql` (수동 기록 모델 + 비료명 컬럼)

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

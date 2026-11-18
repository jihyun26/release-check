# Release Check

배포 전후 점검을 등록·진행·보관하는 교육용 모노레포입니다. 모든 데이터는 가상 데이터이며, 개인 인증이나 실제 배포 실행 기능은 제공하지 않습니다.

## 기술 구성

- Node.js 22.22.0, npm workspaces
- Next.js 16.4.6 / React 19.2.3 / Tailwind CSS 4.1.17
- NestJS 11.2.10 / Prisma 7.10.1 / Neon PostgreSQL
- HttpOnly JWT 세션, 서버 간 service token, scrypt 공통 비밀번호

## 로컬 실행

Node 22.12 이상과 별도 개발용 Neon DB가 필요합니다. Production DB를 개발/테스트에 사용하지 마세요.

1. `npm ci`
2. `apps/web/.env.example`을 `.env.local`, `apps/api/.env.example`을 `.env`로 복사해 값을 입력합니다.
3. `npm run demo:password-hash` 결과를 `DEMO_PASSWORD_HASH`에 넣습니다. `SERVICE_TOKEN`은 양쪽에 같은 32바이트 이상의 난수를, `SESSION_SECRET`은 별도의 32바이트 이상 난수를 사용합니다.
4. `npm run db:generate`
5. `npm run db:migrate -- --name init`
6. 교육용 DB에서만 `ALLOW_DEMO_SEED=true`로 설정한 뒤 `npm run db:seed`
7. `npm run dev` 후 http://localhost:3000 접속

Prisma generate/build와 API runtime에는 `DIRECT_URL`이 필요하지 않습니다. migration에만 Neon direct URL이 필요하고, runtime은 `-pooler` 호스트의 pooled `DATABASE_URL`을 사용합니다. DB/API 연결 실패는 빈 데이터로 대체하지 않고 오류로 표시됩니다.

## 검증 명령

`npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`를 사용합니다. DB 통합/E2E 테스트에는 운영과 분리된 `TEST_DATABASE_URL`/`DIRECT_URL`을 지정해야 하며, 이 저장소는 전체 스키마 자동 reset을 수행하지 않습니다.

## Vercel 배포

같은 저장소에서 Web Root Directory는 `apps/web`, API는 `apps/api`로 두 프로젝트를 만듭니다. Node 22.x를 선택하고 API에 `DATABASE_URL`,`SERVICE_TOKEN`, Web에 `API_BASE_URL`(`/api/v1` 포함),`SERVICE_TOKEN`,`SESSION_SECRET`,`DEMO_PASSWORD_HASH`,`APP_ORIGIN`을 설정합니다. Preview와 Production의 secret 및 Neon branch/DB를 분리합니다.

1. 대상 DB에 로컬/CI의 승인된 migration job으로 `npm run db:deploy`를 먼저 실행합니다.
2. API 배포 후 `/api/v1/health`가 200이고, 보호 endpoint가 token 없이 401인지 확인합니다.
3. Web 배포 후 로그인 → 등록 → PRE/POST 저장 → 완료 → 새로고침 → 이력 확인 smoke test를 수행합니다.
4. Vercel WAF에서 `/api/auth/login` rate limit을 구성합니다. 플랜에서 불가능하면 deployment protection 또는 외부 영속 limiter 전에는 공개하지 않습니다.

현재 저장소에는 Neon/Vercel 자격 정보가 없으므로 실제 배포 성공이나 DB smoke test를 주장하지 않습니다. rollback은 호환되는 이전 코드 배포이며 DB를 자동 복구하지 않습니다. destructive migration은 금지하고 expand/contract 방식으로 변경합니다.

## 인증 한계

공통 비밀번호의 actor는 항상 `demo-user`/`실습 사용자`입니다. 담당자 이름은 표시 문자열일 뿐 인증 사용자가 아닙니다. 이 MVP는 팀 실사용용 SSO, 개인 권한, 승인·감사 수준을 제공하지 않습니다.

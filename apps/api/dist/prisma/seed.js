"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_neon_1 = require("@prisma/adapter-neon");
const client_1 = require("../src/generated/prisma/client");
if (process.env.ALLOW_DEMO_SEED !== 'true')
    throw new Error('Set ALLOW_DEMO_SEED=true to seed demo data');
if (!process.env.DATABASE_URL)
    throw new Error('DATABASE_URL is required');
const db = new client_1.PrismaClient({ adapter: new adapter_neon_1.PrismaNeon({ connectionString: process.env.DATABASE_URL }) });
const ids = { moment: '10000000-0000-4000-8000-000000000001', aurora: '10000000-0000-4000-8000-000000000002', light: '10000000-0000-4000-8000-000000000003' };
const pre = ['변경 내용 및 영향 범위 검토', '테스트 환경 기능 검증', '데이터 백업 및 복구 절차 확인', '환경변수와 배포 설정 확인'], post = ['주요 페이지 정상 접속 확인', '로그인·회원가입 기능 확인', '오류 로그 및 응답 상태 확인', '모바일 화면 및 주요 동선 확인'];
const tids = [...Array(8)].map((_, i) => `20000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`);
async function release(id, key, siteId, title, versionLabel, ownerName, days, status, results) { if (await db.release.findUnique({ where: { id } }))
    return; const site = await db.site.findUniqueOrThrow({ where: { id: siteId } }), date = new Date(); date.setUTCDate(date.getUTCDate() + days); const completed = status === 'COMPLETED' ? new Date() : null; await db.release.create({ data: { id, createKey: key, createPayloadHash: 'seed', siteId, siteNameSnapshot: site.name, title, versionLabel, ownerName, scheduledDate: date, status, completedAt: completed, revision: results.some(x => x !== 'PENDING') ? 2 : 1, items: { create: [...pre, ...post].map((label, i) => ({ templateItemId: tids[i], phase: i < 4 ? 'PRE' : 'POST', label, sortOrder: i, result: results[i], note: results[i] === 'ISSUE' ? '샘플 응답 지연' : '', checkedAt: results[i] !== 'PENDING' ? new Date() : null, checkedBy: results[i] !== 'PENDING' ? '실습 사용자' : null })) }, events: { create: [{ type: 'CREATED', actorId: 'demo-user', after: { title } }, ...(completed ? [{ type: 'COMPLETED', actorId: 'demo-user', after: { status: 'COMPLETED' } }] : [])] } } }); }
async function main() { const sites = [['moment', '모먼트 회원서비스', '회원가입·로그인·계정 관리'], ['aurora', '오로라 학습포털', '학습 콘텐츠·수강 관리'], ['light', '라이트 운영콘솔', '운영 대시보드·관리 기능']]; for (const [k, name, description] of sites)
    await db.site.upsert({ where: { id: ids[k] }, update: {}, create: { id: ids[k], name, description } }); for (let i = 0; i < 8; i++)
    await db.templateItem.upsert({ where: { id: tids[i] }, update: {}, create: { id: tids[i], phase: i < 4 ? client_1.Phase.PRE : client_1.Phase.POST, label: [...pre, ...post][i], sortOrder: i % 4 } }); await release('30000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', ids.moment, '회원가입 화면 개선', 'v1.4.0', '김하늘', 0, client_1.ReleaseStatus.IN_PROGRESS, ['PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'PENDING', 'PENDING', 'PENDING']); await release('30000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000002', ids.aurora, '학습 진도 표시 오류 수정', 'v2.1.2', '이바다', -1, client_1.ReleaseStatus.COMPLETED, Array(8).fill('PASS')); await release('30000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000003', ids.light, '월간 리포트 기능 추가', 'v1.2.0', '박새봄', -2, client_1.ReleaseStatus.BLOCKED, ['PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'ISSUE', 'PENDING']); await release('30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000004', ids.aurora, '콘텐츠 검색 필터 개선', 'v2.1.1', '김하늘', -4, client_1.ReleaseStatus.COMPLETED, Array(8).fill('PASS')); }
main().finally(() => db.$disconnect());
//# sourceMappingURL=seed.js.map
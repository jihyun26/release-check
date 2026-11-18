"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const common_2 = require("./common");
const prisma_1 = require("./prisma");
const dto_1 = require("./dto");
const releases_service_1 = require("./releases.service");
const page = (q) => ({ page: Math.max(1, +q.page || 1), pageSize: Math.min(100, Math.max(1, +q.pageSize || 20)) });
let HealthController = class HealthController {
    get() { return { status: 'ok' }; }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "get", null);
HealthController = __decorate([
    (0, common_1.Controller)('health')
], HealthController);
let SitesController = class SitesController {
    db;
    constructor(db) {
        this.db = db;
    }
    async list(q) { const p = page(q), where = {}; if (q.archived !== 'all')
        where.archivedAt = q.archived === 'archived' ? { not: null } : null; if (q.q)
        where.name = { contains: String(q.q).trim(), mode: 'insensitive' }; const [data, total] = await Promise.all([this.db.site.findMany({ where, orderBy: { name: 'asc' }, skip: (p.page - 1) * p.pageSize, take: p.pageSize }), this.db.site.count({ where })]); return { data, meta: { ...p, total, totalPages: Math.ceil(total / p.pageSize) } }; }
    async create(d) { try {
        return { data: await this.db.site.create({ data: { name: d.name.trim(), description: d.description?.trim() || null } }) };
    }
    catch (e) {
        if (e.code === 'P2002')
            (0, common_2.fail)(409, 'SITE_NAME_EXISTS', '이미 사용 중인 사이트명입니다.');
        throw e;
    } }
    async update(id, d) { const data = {}; if (d.name !== undefined)
        data.name = d.name.trim(); if (d.description !== undefined)
        data.description = d.description.trim() || null; if (d.archived !== undefined)
        data.archivedAt = d.archived ? new Date() : null; try {
        const r = await this.db.site.updateMany({ where: { id, revision: d.revision }, data: { ...data, revision: { increment: 1 } } });
        if (!r.count)
            (0, common_2.fail)(409, 'REVISION_CONFLICT', '다른 창에서 변경됐습니다.');
        return { data: await this.db.site.findUniqueOrThrow({ where: { id } }) };
    }
    catch (e) {
        if (e.code === 'P2002')
            (0, common_2.fail)(409, 'SITE_NAME_EXISTS', '이미 사용 중인 사이트명입니다.');
        throw e;
    } }
    async effective(id) { const site = await this.db.site.findUnique({ where: { id } }); if (!site)
        (0, common_2.fail)(404, 'NOT_FOUND', '사이트를 찾을 수 없습니다.'); const rows = await this.db.templateItem.findMany({ where: { active: true, OR: [{ siteId: null }, { siteId: id }] }, orderBy: [{ phase: 'asc' }, { siteId: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }] }); return { data: { pre: rows.filter(x => x.phase === 'PRE'), post: rows.filter(x => x.phase === 'POST'), total: rows.length } }; }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateSiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateSiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/effective-checklist'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "effective", null);
SitesController = __decorate([
    (0, common_1.Controller)('sites'),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], SitesController);
let TemplatesController = class TemplatesController {
    db;
    constructor(db) {
        this.db = db;
    }
    async list(q) { const p = page(q), where = { siteId: q.scope === 'common' ? null : q.siteId }; if (q.active !== 'all')
        where.active = q.active !== 'false'; const [data, total] = await Promise.all([this.db.templateItem.findMany({ where, orderBy: [{ phase: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }], skip: (p.page - 1) * p.pageSize, take: p.pageSize }), this.db.templateItem.count({ where })]); return { data, meta: { ...p, total, totalPages: Math.ceil(total / p.pageSize) } }; }
    async create(d) { return { data: await this.db.templateItem.create({ data: { ...d, label: d.label.trim() } }) }; }
    async update(id, d) { const { revision, ...data } = d; const r = await this.db.templateItem.updateMany({ where: { id, revision }, data: { ...data, ...(data.label ? { label: data.label.trim() } : {}), revision: { increment: 1 } } }); if (!r.count)
        (0, common_2.fail)(409, 'REVISION_CONFLICT', '다른 창에서 변경됐습니다.'); return { data: await this.db.templateItem.findUniqueOrThrow({ where: { id } }) }; }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "update", null);
TemplatesController = __decorate([
    (0, common_1.Controller)('template-items'),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], TemplatesController);
let ReleasesController = class ReleasesController {
    svc;
    db;
    constructor(svc, db) {
        this.svc = svc;
        this.db = db;
    }
    list(q) { return this.svc.list(q); }
    async create(key, d, res) { const r = await this.svc.create(key, d); res.status(r.created ? 201 : 200); return { data: r.data }; }
    async get(id) { return { data: await this.svc.get(id) }; }
    async item(id, itemId, d) { return { data: await this.svc.updateItem(id, itemId, d) }; }
    async complete(id, d) { return { data: await this.svc.complete(id, d.revision) }; }
    async events(id, q) { const p = page(q), where = { releaseId: id }; const [data, total] = await Promise.all([this.db.releaseEvent.findMany({ where, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (p.page - 1) * p.pageSize, take: p.pageSize }), this.db.releaseEvent.count({ where })]); return { data, meta: { ...p, total, totalPages: Math.ceil(total / p.pageSize) } }; }
    async exp(id, res) { const release = await this.svc.get(id), events = await this.db.releaseEvent.findMany({ where: { releaseId: id }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] }); res.setHeader('Content-Disposition', `attachment; filename="release-${id}.json"`); res.json({ data: { release, events } }); }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReleasesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('idempotency-key')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateReleaseDto, Object]),
    __metadata("design:returntype", Promise)
], ReleasesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReleasesController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id/items/:itemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.UpdateItemDto]),
    __metadata("design:returntype", Promise)
], ReleasesController.prototype, "item", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CompleteDto]),
    __metadata("design:returntype", Promise)
], ReleasesController.prototype, "complete", null);
__decorate([
    (0, common_1.Get)(':id/events'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReleasesController.prototype, "events", null);
__decorate([
    (0, common_1.Get)(':id/export'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReleasesController.prototype, "exp", null);
ReleasesController = __decorate([
    (0, common_1.Controller)('releases'),
    __metadata("design:paramtypes", [releases_service_1.ReleasesService, prisma_1.PrismaService])
], ReleasesController);
let DashboardController = class DashboardController {
    db;
    constructor(db) {
        this.db = db;
    }
    async get() { const [total, planned, progress, blocked, completed, recent, sites] = await Promise.all([this.db.release.count(), this.db.release.count({ where: { status: 'PLANNED' } }), this.db.release.count({ where: { status: 'IN_PROGRESS' } }), this.db.release.count({ where: { status: 'BLOCKED' } }), this.db.release.count({ where: { status: 'COMPLETED' } }), this.db.release.findMany({ take: 5, orderBy: { createdAt: 'desc' } }), this.db.site.findMany({ where: { archivedAt: null }, include: { _count: { select: { releases: true } } } })]); return { data: { counts: { total, inProgress: planned + progress, blocked, completed }, recentReleases: recent, sites: sites.map(s => ({ id: s.id, name: s.name, releases: s._count.releases })) } }; }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "get", null);
DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], DashboardController);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({ imports: [common_2.CommonModule, prisma_1.PrismaModule], controllers: [HealthController, SitesController, TemplatesController, ReleasesController, DashboardController], providers: [releases_service_1.ReleasesService, { provide: core_1.APP_GUARD, useClass: common_2.ServiceTokenGuard }] })
], AppModule);
//# sourceMappingURL=app.module.js.map
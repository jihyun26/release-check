"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.CommonModule = exports.ApiExceptionFilter = exports.ServiceTokenGuard = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let ServiceTokenGuard = class ServiceTokenGuard {
    canActivate(c) { const req = c.switchToHttp().getRequest(); if (req.path.endsWith('/health'))
        return true; const actual = req.header('x-service-token') || '', expected = process.env.SERVICE_TOKEN || ''; if (!expected || actual.length !== expected.length || !(0, crypto_1.timingSafeEqual)(Buffer.from(actual), Buffer.from(expected)))
        throw new common_1.HttpException({ code: 'UNAUTHORIZED', message: '인증이 필요합니다.' }, 401); return true; }
};
exports.ServiceTokenGuard = ServiceTokenGuard;
exports.ServiceTokenGuard = ServiceTokenGuard = __decorate([
    (0, common_1.Injectable)()
], ServiceTokenGuard);
let ApiExceptionFilter = class ApiExceptionFilter {
    catch(error, host) { const res = host.switchToHttp().getResponse(), req = host.switchToHttp().getRequest(); const status = error instanceof common_1.HttpException ? error.getStatus() : common_1.HttpStatus.SERVICE_UNAVAILABLE; const body = error instanceof common_1.HttpException ? error.getResponse() : {}; const obj = typeof body === 'object' ? body : {}; res.status(status).json({ error: { code: obj.code || (status === 400 ? 'VALIDATION_ERROR' : status === 404 ? 'NOT_FOUND' : status === 409 ? 'REVISION_CONFLICT' : 'DATABASE_UNAVAILABLE'), message: obj.message || (status === 503 ? '서비스에 연결할 수 없습니다.' : '요청을 처리하지 못했습니다.'), details: obj.details || {}, requestId: req.requestId } }); }
};
exports.ApiExceptionFilter = ApiExceptionFilter;
exports.ApiExceptionFilter = ApiExceptionFilter = __decorate([
    (0, common_1.Catch)()
], ApiExceptionFilter);
let CommonModule = class CommonModule {
    configure(c) { c.apply((req, res, next) => { req.requestId = req.header('x-request-id') || (0, crypto_1.randomUUID)(); res.setHeader('x-request-id', req.requestId); next(); }).forRoutes('*'); }
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({ providers: [ServiceTokenGuard, ApiExceptionFilter], exports: [ServiceTokenGuard, ApiExceptionFilter] })
], CommonModule);
const fail = (status, code, message, details = {}) => { throw new common_1.HttpException({ code, message, details }, status); };
exports.fail = fail;
//# sourceMappingURL=common.js.map
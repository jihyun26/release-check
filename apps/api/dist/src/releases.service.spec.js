"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const releases_service_1 = require("./releases.service");
const client_1 = require("./generated/prisma/client");
describe('release progress', () => { it('counts only PASS and NA', () => { expect((0, releases_service_1.progress)([{ result: client_1.ItemResult.PASS }, { result: client_1.ItemResult.NA }, { result: client_1.ItemResult.ISSUE }, { result: client_1.ItemResult.PENDING }])).toEqual({ done: 2, total: 4, percent: 50 }); }); it('handles empty', () => expect((0, releases_service_1.progress)([])).toEqual({ done: 0, total: 0, percent: 0 })); });
//# sourceMappingURL=releases.service.spec.js.map
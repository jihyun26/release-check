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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteDto = exports.UpdateItemDto = exports.CreateReleaseDto = exports.UpdateTemplateDto = exports.CreateTemplateDto = exports.UpdateSiteDto = exports.CreateSiteDto = void 0;
const class_validator_1 = require("class-validator");
const enums_1 = require("./generated/prisma/enums");
class CreateSiteDto {
    name;
    description;
}
exports.CreateSiteDto = CreateSiteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateSiteDto.prototype, "description", void 0);
class UpdateSiteDto {
    revision;
    name;
    description;
    archived;
}
exports.UpdateSiteDto = UpdateSiteDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateSiteDto.prototype, "revision", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateSiteDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSiteDto.prototype, "archived", void 0);
class CreateTemplateDto {
    siteId;
    phase;
    label;
    sortOrder;
}
exports.CreateTemplateDto = CreateTemplateDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "siteId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.Phase),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "phase", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 150),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(9999),
    __metadata("design:type", Number)
], CreateTemplateDto.prototype, "sortOrder", void 0);
class UpdateTemplateDto {
    revision;
    label;
    sortOrder;
    active;
}
exports.UpdateTemplateDto = UpdateTemplateDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateTemplateDto.prototype, "revision", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 150),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(9999),
    __metadata("design:type", Number)
], UpdateTemplateDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTemplateDto.prototype, "active", void 0);
class CreateReleaseDto {
    siteId;
    title;
    versionLabel;
    ownerName;
    scheduledDate;
    description;
}
exports.CreateReleaseDto = CreateReleaseDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReleaseDto.prototype, "siteId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 80),
    __metadata("design:type", String)
], CreateReleaseDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 30),
    __metadata("design:type", String)
], CreateReleaseDto.prototype, "versionLabel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 30),
    __metadata("design:type", String)
], CreateReleaseDto.prototype, "ownerName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 10),
    __metadata("design:type", String)
], CreateReleaseDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateReleaseDto.prototype, "description", void 0);
class UpdateItemDto {
    revision;
    result;
    note;
}
exports.UpdateItemDto = UpdateItemDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateItemDto.prototype, "revision", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.ItemResult),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "result", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "note", void 0);
class CompleteDto {
    revision;
}
exports.CompleteDto = CompleteDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CompleteDto.prototype, "revision", void 0);
//# sourceMappingURL=dto.js.map
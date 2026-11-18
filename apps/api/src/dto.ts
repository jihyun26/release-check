import {IsBoolean,IsEnum,IsInt,IsOptional,IsString,IsUUID,Length,Max,MaxLength,Min} from 'class-validator'; import {Phase,ItemResult} from './generated/prisma/enums';
export class CreateSiteDto{@IsString()@Length(1,50)name!:string;@IsOptional()@IsString()@MaxLength(200)description?:string}
export class UpdateSiteDto{@IsInt()@Min(1)revision!:number;@IsOptional()@IsString()@Length(1,50)name?:string;@IsOptional()@IsString()@MaxLength(200)description?:string;@IsOptional()@IsBoolean()archived?:boolean}
export class CreateTemplateDto{@IsOptional()@IsUUID()siteId?:string;@IsEnum(Phase)phase!:Phase;@IsString()@Length(1,150)label!:string;@IsInt()@Min(0)@Max(9999)sortOrder!:number}
export class UpdateTemplateDto{@IsInt()@Min(1)revision!:number;@IsOptional()@IsString()@Length(1,150)label?:string;@IsOptional()@IsInt()@Min(0)@Max(9999)sortOrder?:number;@IsOptional()@IsBoolean()active?:boolean}
export class CreateReleaseDto{@IsUUID()siteId!:string;@IsString()@Length(1,80)title!:string;@IsString()@Length(1,30)versionLabel!:string;@IsString()@Length(1,30)ownerName!:string;@IsString()@Length(10,10)scheduledDate!:string;@IsOptional()@IsString()@MaxLength(2000)description?:string}
export class UpdateItemDto{@IsInt()@Min(1)revision!:number;@IsEnum(ItemResult)result!:ItemResult;@IsString()@MaxLength(2000)note!:string}
export class CompleteDto{@IsInt()@Min(1)revision!:number}

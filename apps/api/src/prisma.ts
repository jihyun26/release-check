import {Global,Injectable,Module,OnModuleDestroy} from '@nestjs/common'; import {PrismaNeon} from '@prisma/adapter-neon'; import {PrismaClient} from './generated/prisma/client';
@Injectable() export class PrismaService extends PrismaClient implements OnModuleDestroy { constructor(){const url=process.env.DATABASE_URL;if(!url)throw new Error('DATABASE_URL is required');super({adapter:new PrismaNeon({connectionString:url})})} async onModuleDestroy(){await this.$disconnect()}}
@Global() @Module({providers:[PrismaService],exports:[PrismaService]}) export class PrismaModule{}

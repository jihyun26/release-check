"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const common_2 = require("./common");
async function bootstrap() { const app = await core_1.NestFactory.create(app_module_1.AppModule); app.setGlobalPrefix('api/v1'); app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })); app.useGlobalFilters(app.get(common_2.ApiExceptionFilter)); await app.listen(process.env.PORT ?? 3001); }
void bootstrap();
//# sourceMappingURL=main.js.map
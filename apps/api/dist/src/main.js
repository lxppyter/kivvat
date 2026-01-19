"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const fingerprint_exception_filter_1 = require("./common/filters/fingerprint.exception.filter");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new fingerprint_exception_filter_1.FingerprintExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        xssFilter: true,
        noSniff: true,
        hidePoweredBy: true,
        frameguard: { action: 'deny' },
    }));
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
        credentials: true,
    });
    const port = process.env.PORT || 3000;
    console.log(`Application is running on: http://localhost:${port} [v2.2]`);
    console.log(`\x1b[31m
    ********************************************
    * KIVVAT SECURITY ENGINE (AGPLv3 LICENSED) *
    * COPYRIGHT (C) 2026 KIVVAT INC.           *
    * UNAUTHORIZED COPYING IS PROHIBITED       *
    * TRACKING ID: KIV-992-X-771               *
    ********************************************
    \x1b[0m`);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map
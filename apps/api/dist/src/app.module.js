"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const evidence_module_1 = require("./evidence/evidence.module");
const analysis_module_1 = require("./analysis/analysis.module");
const task_module_1 = require("./task/task.module");
const report_module_1 = require("./report/report.module");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const compliance_module_1 = require("./compliance/compliance.module");
const cloud_module_1 = require("./cloud/cloud.module");
const scanner_module_1 = require("./scanner/scanner.module");
const policy_module_1 = require("./policy/policy.module");
const incident_module_1 = require("./incident/incident.module");
const ssl_module_1 = require("./ssl/ssl.module");
const vendor_module_1 = require("./vendor/vendor.module");
const payment_module_1 = require("./payment/payment.module");
const asset_module_1 = require("./asset/asset.module");
const audit_module_1 = require("./audit/audit.module");
const auditor_readonly_guard_1 = require("./common/guards/auditor-readonly.guard");
const watermark_middleware_1 = require("./common/middleware/watermark.middleware");
const origin_middleware_1 = require("./common/middleware/origin.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(watermark_middleware_1.WatermarkMiddleware, origin_middleware_1.OriginGuardMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 60,
                },
            ]),
            evidence_module_1.EvidenceModule,
            analysis_module_1.AnalysisModule,
            task_module_1.TaskModule,
            report_module_1.ReportModule,
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            compliance_module_1.ComplianceModule,
            cloud_module_1.CloudModule,
            scanner_module_1.ScannerModule,
            policy_module_1.PolicyModule,
            incident_module_1.IncidentModule,
            ssl_module_1.SslModule,
            vendor_module_1.VendorModule,
            payment_module_1.PaymentModule,
            asset_module_1.AssetModule,
            audit_module_1.AuditModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: auditor_readonly_guard_1.AuditorReadOnlyGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
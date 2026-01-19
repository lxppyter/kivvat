import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvidenceModule } from './evidence/evidence.module';
import { AnalysisModule } from './analysis/analysis.module';
import { TaskModule } from './task/task.module';
import { ReportModule } from './report/report.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ComplianceModule } from './compliance/compliance.module';
import { CloudModule } from './cloud/cloud.module';
import { ScannerModule } from './scanner/scanner.module';
import { PolicyModule } from './policy/policy.module';
import { IncidentModule } from './incident/incident.module';
import { SslModule } from './ssl/ssl.module';
import { VendorModule } from './vendor/vendor.module';
import { PaymentModule } from './payment/payment.module';

import { AssetModule } from './asset/asset.module';
import { AuditModule } from './audit/audit.module';
import { AuditorReadOnlyGuard } from './common/guards/auditor-readonly.guard';
import { WatermarkMiddleware } from './common/middleware/watermark.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    EvidenceModule,
    AnalysisModule,
    TaskModule,
    ReportModule,
    TaskModule,
    ReportModule,
    PrismaModule,
    AuthModule,
    ComplianceModule,
    CloudModule,
    ScannerModule,
    PolicyModule,
    IncidentModule,
    SslModule,
    VendorModule,
    PaymentModule,
    AssetModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuditorReadOnlyGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WatermarkMiddleware)
      .forRoutes('*');
  }
}

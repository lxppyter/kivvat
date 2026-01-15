import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvidenceModule } from './evidence/evidence.module';
import { AnalysisModule } from './analysis/analysis.module';
import { TaskModule } from './task/task.module';
import { ReportModule } from './report/report.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EvidenceModule, AnalysisModule, TaskModule, ReportModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

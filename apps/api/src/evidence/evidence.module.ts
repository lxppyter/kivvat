import { Module } from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { EvidenceController } from './evidence.controller';
import { AnalysisModule } from '../analysis/analysis.module';
import { ReportModule } from '../report/report.module';

@Module({
  imports: [AnalysisModule, ReportModule],
  controllers: [EvidenceController],
  providers: [EvidenceService],
})
export class EvidenceModule {}

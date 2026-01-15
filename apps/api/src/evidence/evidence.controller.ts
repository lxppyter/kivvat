import { Controller, Post, Body } from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { AnalysisService } from '../analysis/analysis.service';

@Controller('evidence')
export class EvidenceController {
  constructor(
    private readonly evidenceService: EvidenceService,
    private readonly analysisService: AnalysisService,
  ) {}

  @Post('scan')
  async runScan(@Body('provider') provider: string = 'AWS') {
    // 1. Collect
    const evidence = await this.evidenceService.collectEvidence(provider);
    
    // 2. Analyze
    const gap = await this.analysisService.analyzeEvidence(evidence);

    return {
      message: 'Scan completed',
      evidence,
      gap,
    };
  }
}

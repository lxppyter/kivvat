import { Controller, Get, Param } from '@nestjs/common';
import { EvidenceService } from './evidence.service';

@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Get('history/:controlId')
  async getHistory(@Param('controlId') controlId: string) {
    return this.evidenceService.getHistory(controlId);
  }

  @Get(':id')
  async getEvidence(@Param('id') id: string) {
    return this.evidenceService.getEvidence(id);
  }
}

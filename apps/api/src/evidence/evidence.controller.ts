import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionGuard } from '../common/guards/subscription.guard';

@UseGuards(AuthGuard('jwt'), SubscriptionGuard)
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

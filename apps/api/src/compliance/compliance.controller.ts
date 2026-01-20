import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('summary')
  getSummary() {
    return this.complianceService.getSummary();
  }

  @Get('standards')
  async getStandards(@Request() req: any) {
    return this.complianceService.findAll(req.user.userId || req.user.id);
  }
}

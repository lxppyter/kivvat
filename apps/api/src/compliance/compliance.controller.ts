import { Controller, Get, UseGuards } from '@nestjs/common';
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
  getStandards() {
    return this.complianceService.findAll();
  }
}

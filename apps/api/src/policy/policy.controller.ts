import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { PolicyService } from './policy.service';

@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Get('templates')
  async getTemplates() {
    return this.policyService.getTemplates();
  }

  @Get('assignments')
  async getAssignments(@Query('userId') userId?: string) {
    return this.policyService.getAssignments(userId);
  }
  @Get('download/:id')
  async downloadTemplate(@Param('id') id: string, @Query('companyName') companyName: string) {
    return this.policyService.downloadTemplate(id, companyName || 'ACME Corp');
  }

  @Post('sign/:id')
  async signPolicy(@Param('id') id: string) {
    return this.policyService.signPolicy(id);
  }

  @Post(':id') // Using POST for update to avoid PATCH complexity for now
  async updatePolicy(@Param('id') id: string, @Body('content') content: string) {
    return this.policyService.updatePolicy(id, content);
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.policyService.getHistory(id);
  }
}

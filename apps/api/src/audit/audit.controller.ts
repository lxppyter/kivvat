import { Controller, Post, Body, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('share')
  async createShareLink(@Request() req: any, @Body() body: { name: string, hours?: number }) {
    return this.auditService.createShareLink(
        req.user.userId, 
        body.name || 'Auditor Access', 
        body.hours || 24
    );
  }

  @Post('access')
  async accessAudit(@Body() body: { token: string }) {
    const share = await this.auditService.verifyShareToken(body.token);
    return this.auditService.createAuditorToken(share);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('shares')
  async listShares(@Request() req: any) {
    return this.auditService.getMyShares(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('share/:id')
  async revokeShare(@Request() req: any, @Param('id') id: string) {
    return this.auditService.revokeShare(req.user.userId, id);
  }
}

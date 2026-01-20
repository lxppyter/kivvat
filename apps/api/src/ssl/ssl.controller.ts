import { Controller, Get, Param, BadRequestException, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { SslService } from './ssl.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('ssl')
@UseGuards(AuthGuard('jwt'))
export class SslController {
  constructor(private readonly sslService: SslService) {}

  @Get('check/:domain')
  async checkDomain(@Param('domain') domain: string, @Request() req: any) {
    if (!['PRO', 'ENTERPRISE'].includes(req.user.plan)) {
        throw new ForbiddenException('SSL Sertifika Takibi sadece TRUST ARCHITECT (PRO) ve üzeri paketlerde mevcuttur.');
    }
    if (!domain) throw new BadRequestException('Domain is required');
    return this.sslService.checkCertificate(domain);
  }
}

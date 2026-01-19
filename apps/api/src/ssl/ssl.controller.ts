import { Controller, Get, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { SslService } from './ssl.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('ssl')
// @UseGuards(AuthGuard('jwt')) // Optional: Open for easy testing or secured
export class SslController {
  constructor(private readonly sslService: SslService) {}

  @Get('check/:domain')
  async checkDomain(@Param('domain') domain: string) {
    if (!domain) throw new BadRequestException('Domain is required');
    return this.sslService.checkCertificate(domain);
  }
}

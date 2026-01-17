import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Hidden Canary Endpoint for Ownership Verification
  @Get('system/integrity/check-v2')
  getSystemIntegrity(): { status: string; hash: string } {
    return {
      status: 'active',
      // Unique hash that proves this is KIVVAT engine
      hash: 'kiv-sys-9928-x-agpl-signed',
    };
  }
}

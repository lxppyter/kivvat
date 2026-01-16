import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('scanner')
export class ScannerController {
  constructor(private readonly scannerService: ScannerService) {}

  @Get('reports')
  async getReports(@Req() req: any) {
    return this.scannerService.getReports(req.user.userId);
  }

  @Post('assets/sync')
  async syncAssets(@Req() req: any, @Body() body: { credentials: any }) {
    return this.scannerService.syncAssets(req.user.userId, body.credentials);
  }

  @Get('assets')
  async getAssets(@Req() req: any) {
    return this.scannerService.getAssets(req.user.userId);
  }

  @Post('run')
  async runScan(@Body() body: { provider: string; credentials: any }, @Req() req: any) {
    console.log('User in Controller:', req.user);
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID missing from request');
    const creds = body.credentials || {}; 
    // If provider is DEMO, we just run the manual scan part of runScan
    return this.scannerService.runScan(body.provider, creds, userId);
  }
}

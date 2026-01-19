import { Controller, Post, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { AuthGuard } from '@nestjs/passport';
import { AssetService } from '../asset/asset.service';

@UseGuards(AuthGuard('jwt'))
@Controller('cloud')
export class CloudController {
  constructor(
    private readonly cloudService: CloudService,
    private readonly assetService: AssetService
  ) {}

  @Post('connect/:provider')
  async connect(@Param('provider') provider: string, @Body() credentials: any, @Request() req: any) {
    const user = req.user;
    
    // Check Limits
    const currentCount = await this.assetService.countByType(user.userId, 'ACCOUNT');
    let limit = 0; // FREE
    
    if (user.plan === 'CORE') limit = 1;
    else if (user.plan === 'PRO') limit = 3;
    else if (user.plan === 'ENTERPRISE') limit = 999;

    if (currentCount >= limit) {
        throw new ForbiddenException(`Plan limitinize ulaştınız (${limit} Bulut Hesabı). Lütfen paketinizi yükseltin.`);
    }

    // Verify
    const result = await this.cloudService.connect(provider, credentials);
    
    // Save as Asset to track usage
    // Note: We do NOT save the actual credentials/secrets here for security simplicity in this demo refactor.
    // We just track that an account exists.
    // In a real app, you'd save an encrypted connection record.
    await this.assetService.create(user.userId, {
        provider: provider.toUpperCase(),
        type: 'ACCOUNT',
        name: `${provider.toUpperCase()} Connection`,
        details: { verified: true, connectedAt: new Date() },
        status: 'ACTIVE'
    });

    return result;
  }
}

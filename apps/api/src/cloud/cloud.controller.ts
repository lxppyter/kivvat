import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('cloud')
export class CloudController {
  constructor(private readonly cloudService: CloudService) {}

  @Post('connect/:provider')
  async connect(@Param('provider') provider: string, @Body() credentials: any) {
    return this.cloudService.connect(provider, credentials);
  }
}

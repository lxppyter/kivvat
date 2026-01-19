import { Module } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { CloudController } from './cloud.controller';
import { AwsProvider } from './providers/aws.provider';
import { AzureProvider } from './providers/azure.provider';
import { GcpProvider } from './providers/gcp.provider';

import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [AssetModule],
  controllers: [CloudController],
  providers: [CloudService, AwsProvider, AzureProvider, GcpProvider],
  exports: [CloudService],
})
export class CloudModule {}

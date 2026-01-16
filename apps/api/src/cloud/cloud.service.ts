import { Injectable, BadRequestException } from '@nestjs/common';
import { AwsProvider } from './providers/aws.provider';
import { AzureProvider } from './providers/azure.provider';
import { GcpProvider } from './providers/gcp.provider';

@Injectable()
export class CloudService {
  constructor(
    private awsProvider: AwsProvider,
    private azureProvider: AzureProvider,
    private gcpProvider: GcpProvider,
  ) {}

  async connect(provider: string, credentials: any) {
    switch (provider.toLowerCase()) {
      case 'aws':
        return this.awsProvider.verifyCredentials(credentials);
      case 'azure':
        return this.azureProvider.verifyCredentials(credentials);
      case 'gcp':
        return this.gcpProvider.verifyCredentials(credentials);
      default:
        throw new BadRequestException('Unsupported cloud provider');
    }
  }
}

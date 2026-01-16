import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudProvider } from './cloud.provider.interface';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';

@Injectable()
export class AwsProvider implements CloudProvider {
  async verifyCredentials(credentials: any): Promise<any> {
    const { accessKeyId, secretAccessKey, region } = credentials;

    if (!accessKeyId || !secretAccessKey) {
      throw new BadRequestException('Missing AWS Access Key or Secret Key');
    }

    try {
      const client = new STSClient({
        region: region || 'us-east-1',
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const command = new GetCallerIdentityCommand({});
      const response = await client.send(command);

      return {
        provider: 'AWS',
        accountId: response.Account,
        arn: response.Arn,
        userId: response.UserId,
      };
    } catch (error) {
      console.error('AWS Connection Error:', error);
      throw new BadRequestException('Failed to connect to AWS. Check credentials.');
    }
  }
}

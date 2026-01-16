import { Injectable, NotImplementedException } from '@nestjs/common';
import { CloudProvider } from './cloud.provider.interface';

@Injectable()
export class AzureProvider implements CloudProvider {
  async verifyCredentials(credentials: any): Promise<any> {
    throw new NotImplementedException('Azure connection not implemented yet.');
  }
}

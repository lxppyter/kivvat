import { Injectable, NotImplementedException } from '@nestjs/common';
import { CloudProvider } from './cloud.provider.interface';

@Injectable()
export class GcpProvider implements CloudProvider {
  async verifyCredentials(credentials: any): Promise<any> {
    throw new NotImplementedException('GCP connection not implemented yet.');
  }
}

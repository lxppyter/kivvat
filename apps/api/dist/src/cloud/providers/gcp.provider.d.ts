import { CloudProvider } from './cloud.provider.interface';
export declare class GcpProvider implements CloudProvider {
    verifyCredentials(credentials: any): Promise<any>;
}

import { CloudProvider } from './cloud.provider.interface';
export declare class AzureProvider implements CloudProvider {
    verifyCredentials(credentials: any): Promise<any>;
}

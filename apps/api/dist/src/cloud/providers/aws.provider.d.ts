import { CloudProvider } from './cloud.provider.interface';
export declare class AwsProvider implements CloudProvider {
    verifyCredentials(credentials: any): Promise<any>;
}

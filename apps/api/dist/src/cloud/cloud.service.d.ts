import { AwsProvider } from './providers/aws.provider';
import { AzureProvider } from './providers/azure.provider';
import { GcpProvider } from './providers/gcp.provider';
export declare class CloudService {
    private awsProvider;
    private azureProvider;
    private gcpProvider;
    constructor(awsProvider: AwsProvider, azureProvider: AzureProvider, gcpProvider: GcpProvider);
    connect(provider: string, credentials: any): Promise<any>;
}

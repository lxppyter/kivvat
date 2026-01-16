import { CloudService } from './cloud.service';
export declare class CloudController {
    private readonly cloudService;
    constructor(cloudService: CloudService);
    connect(provider: string, credentials: any): Promise<any>;
}

import { CloudService } from './cloud.service';
import { AssetService } from '../asset/asset.service';
export declare class CloudController {
    private readonly cloudService;
    private readonly assetService;
    constructor(cloudService: CloudService, assetService: AssetService);
    connect(provider: string, credentials: any, req: any): Promise<any>;
}

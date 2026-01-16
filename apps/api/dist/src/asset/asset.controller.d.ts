import { AssetService } from './asset.service';
export declare class AssetController {
    private readonly assetService;
    constructor(assetService: AssetService);
    findAll(req: any): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        status: string | null;
        userId: string;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        type: string;
        region: string | null;
        provider: string;
    }[]>;
    create(body: any): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        status: string | null;
        userId: string;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        type: string;
        region: string | null;
        provider: string;
    }>;
}

import { AssetService } from './asset.service';
export declare class AssetController {
    private readonly assetService;
    constructor(assetService: AssetService);
    findAll(req: any): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        status: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        type: string;
        provider: string;
        userId: string;
    }[]>;
    create(req: any, body: any): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        status: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        type: string;
        provider: string;
        userId: string;
    }>;
    update(id: string, body: any): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        status: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        type: string;
        provider: string;
        userId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        status: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        type: string;
        provider: string;
        userId: string;
    }>;
    createBulk(req: any, body: {
        items: any[];
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
}

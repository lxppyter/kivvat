import { AssetService } from './asset.service';
export declare class AssetController {
    private readonly assetService;
    constructor(assetService: AssetService);
    findAll(req: any): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        userId: string;
        status: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        type: string;
        provider: string;
    }[]>;
    create(req: any, body: any): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        userId: string;
        status: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        type: string;
        provider: string;
    }>;
    update(id: string, body: any): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        userId: string;
        status: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        type: string;
        provider: string;
    }>;
    getHistory(id: string): Promise<{
        id: string;
        createdAt: Date;
        oldConfig: import("@prisma/client/runtime/client").JsonValue | null;
        newConfig: import("@prisma/client/runtime/client").JsonValue | null;
        diff: import("@prisma/client/runtime/client").JsonValue | null;
        changedBy: string | null;
        assetId: string;
    }[]>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        userId: string;
        status: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        type: string;
        provider: string;
    }>;
    createBulk(req: any, body: {
        items: any[];
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
}

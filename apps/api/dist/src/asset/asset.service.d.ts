import { PrismaService } from '../prisma/prisma.service';
export declare class AssetService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
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
    countByType(userId: string, type: string): Promise<number>;
    create(userId: string, data: any): Promise<{
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
    createMany(userId: string, data: any[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
    update(id: string, data: any): Promise<{
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
    getHistory(assetId: string): Promise<{
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
    private calculateDiff;
}

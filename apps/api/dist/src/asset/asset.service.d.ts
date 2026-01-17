import { PrismaService } from '../prisma/prisma.service';
export declare class AssetService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
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
    create(userId: string, data: any): Promise<{
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
    createMany(userId: string, data: any[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
    update(id: string, data: any): Promise<{
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
}

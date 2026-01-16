import { PrismaService } from '../prisma/prisma.service';
export declare class AssetService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        status: string | null;
        userId: string;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        provider: string;
        type: string;
    }[]>;
    create(userId: string, data: any): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        status: string | null;
        userId: string;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        provider: string;
        type: string;
    }>;
}

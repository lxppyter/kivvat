import { PrismaService } from '../prisma/prisma.service';
export declare class EvidenceService {
    private prisma;
    constructor(prisma: PrismaService);
    collectEvidence(provider: string): Promise<{
        id: string;
        source: string;
        resourceId: string | null;
        checkName: string;
        result: import("@prisma/client/runtime/client").JsonValue;
        timestamp: Date;
    }>;
}

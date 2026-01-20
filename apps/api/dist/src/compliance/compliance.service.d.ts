import { PrismaService } from '../prisma/prisma.service';
export declare class ComplianceService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        complianceScore: number;
        analyzed: boolean;
        controls: {
            id: string;
            code: string;
            name: string;
            description: string | null;
            status: import("@prisma/client").$Enums.ComplianceStatus;
        }[];
    }[]>;
    getSummary(): Promise<{
        id: string;
        name: string;
        description: string | null;
        progress: number;
        status: string;
        controls: {
            passed: number;
            total: number;
        };
        lastAudit: Date;
    }[]>;
}

import { PrismaService } from '../prisma/prisma.service';
export declare class PolicyService {
    private prisma;
    constructor(prisma: PrismaService);
    getTemplates(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        category: string;
    }[]>;
    getAssignments(userId?: string): Promise<{
        assignments: ({
            user: {
                name: string | null;
                email: string;
            };
            policy: {
                name: string;
                category: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            signedAt: Date | null;
            policyId: string;
            userId: string;
        })[];
        stats: {
            total: number;
            signed: number;
            pending: number;
            overdue: number;
            percentage: number;
        };
    }>;
    signPolicy(assignmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        signedAt: Date | null;
        policyId: string;
        userId: string;
    }>;
    downloadTemplate(templateId: string, companyName: string): Promise<{
        name: string;
        content: string;
    }>;
}

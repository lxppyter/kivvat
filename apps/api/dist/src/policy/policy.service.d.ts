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
        version: string;
    }[]>;
    getAssignments(userId?: string): Promise<{
        assignments: ({
            user: {
                name: string | null;
                email: string;
            } | null;
            policy: {
                name: string;
                category: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            userId: string | null;
            policyId: string;
            signedAt: Date | null;
            signerName: string | null;
            signerEmail: string | null;
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
        userId: string | null;
        policyId: string;
        signedAt: Date | null;
        signerName: string | null;
        signerEmail: string | null;
    }>;
    updatePolicy(id: string, newContent: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        category: string;
        version: string;
    }>;
    getHistory(id: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        version: string;
        policyId: string;
    }[]>;
    downloadTemplate(templateId: string, companyName: string): Promise<{
        name: string;
        content: string;
    }>;
    createShareLink(policyId?: string, expiresAt?: Date | string): Promise<{
        token: string;
        url: string;
    }>;
    getPublicPolicy(token: string): Promise<{
        type: string;
        policies: {
            id: string;
            name: string;
            content: string;
            category: string;
            version: string;
        }[];
        policy?: undefined;
    } | {
        type: string;
        policy: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            category: string;
            version: string;
        } | null;
        policies?: undefined;
    }>;
    signPublicPolicy(token: string, signerName: string, signerEmail: string, policyId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        userId: string | null;
        policyId: string;
        signedAt: Date | null;
        signerName: string | null;
        signerEmail: string | null;
    }>;
    getShares(): Promise<({
        policy: {
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        active: boolean;
        token: string;
        expiresAt: Date | null;
        policyId: string | null;
    })[]>;
    revokeShare(id: string): Promise<{
        id: string;
        createdAt: Date;
        active: boolean;
        token: string;
        expiresAt: Date | null;
        policyId: string | null;
    }>;
}

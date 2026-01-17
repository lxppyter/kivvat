import { PolicyService } from './policy.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class PolicyController {
    private readonly policyService;
    private readonly prisma;
    constructor(policyService: PolicyService, prisma: PrismaService);
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
    downloadTemplate(id: string, companyName: string): Promise<{
        name: string;
        content: string;
    }>;
    signPolicy(id: string): Promise<{
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
    getSignaturesStatus(): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        signedCount: number;
        totalPolicies: number;
        lastSigned: any;
        status: string;
    }[]>;
    updatePolicy(id: string, content: string): Promise<{
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
    getShares(): Promise<({
        policy: {
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        token: string;
        expiresAt: Date | null;
        policyId: string | null;
        active: boolean;
    })[]>;
    revokeShare(id: string): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        expiresAt: Date | null;
        policyId: string | null;
        active: boolean;
    }>;
    createShareAllLink(body: {
        expiresAt?: string;
    }): Promise<{
        token: string;
        url: string;
    }>;
    createShareLink(id: string, body: {
        expiresAt?: string;
    }): Promise<{
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
    signPublicPolicy(token: string, body: {
        name: string;
        email: string;
        policyId?: string;
    }): Promise<{
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
}

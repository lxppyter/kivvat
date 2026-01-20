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
    getAssignments(req: any, queryUserId?: string): Promise<{
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
            userId: string | null;
            status: string;
            policyId: string;
            signedAt: Date | null;
            signerName: string | null;
            signerEmail: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            ownerId: string | null;
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
        userId: string | null;
        status: string;
        policyId: string;
        signedAt: Date | null;
        signerName: string | null;
        signerEmail: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        ownerId: string | null;
    }>;
    getSignaturesStatus(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        signedCount: number;
        totalPolicies: number;
        lastSigned: any;
        lastIp: any;
        lastUserAgent: any;
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
    getShares(req: any): Promise<({
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
        creatorId: string | null;
    })[]>;
    revokeShare(id: string): Promise<{
        id: string;
        createdAt: Date;
        active: boolean;
        token: string;
        expiresAt: Date | null;
        policyId: string | null;
        creatorId: string | null;
    }>;
    createShareAllLink(req: any, body: {
        expiresAt?: string;
    }): Promise<{
        token: string;
        url: string;
    }>;
    createShareLink(id: string, req: any, body: {
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
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: string;
        policyId: string;
        signedAt: Date | null;
        signerName: string | null;
        signerEmail: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        ownerId: string | null;
    }>;
}

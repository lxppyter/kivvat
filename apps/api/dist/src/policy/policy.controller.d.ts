import { PolicyService } from './policy.service';
export declare class PolicyController {
    private readonly policyService;
    constructor(policyService: PolicyService);
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
    downloadTemplate(id: string, companyName: string): Promise<{
        name: string;
        content: string;
    }>;
    signPolicy(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        signedAt: Date | null;
        policyId: string;
        userId: string;
    }>;
}

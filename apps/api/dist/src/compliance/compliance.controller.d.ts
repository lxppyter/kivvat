import { ComplianceService } from './compliance.service';
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
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
    getStandards(): Promise<{
        id: string;
        name: string;
        description: string | null;
        complianceScore: number;
        controls: {
            id: string;
            code: string;
            name: string;
            description: string | null;
            status: import("@prisma/client").$Enums.ComplianceStatus;
        }[];
    }[]>;
}

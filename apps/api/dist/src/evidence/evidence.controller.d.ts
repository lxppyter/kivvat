import { EvidenceService } from './evidence.service';
import { AnalysisService } from '../analysis/analysis.service';
export declare class EvidenceController {
    private readonly evidenceService;
    private readonly analysisService;
    constructor(evidenceService: EvidenceService, analysisService: AnalysisService);
    runScan(provider?: string): Promise<{
        message: string;
        evidence: {
            id: string;
            source: string;
            resourceId: string | null;
            checkName: string;
            result: import("@prisma/client/runtime/client").JsonValue;
            timestamp: Date;
        };
        gap: {
            id: string;
            controlId: string;
            evidenceId: string;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            details: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}

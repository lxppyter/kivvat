import { EvidenceService } from './evidence.service';
export declare class EvidenceController {
    private readonly evidenceService;
    constructor(evidenceService: EvidenceService);
    getHistory(controlId: string): Promise<({
        gaps: {
            id: string;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            details: string | null;
            controlId: string;
            evidenceId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        source: string;
        resourceId: string | null;
        checkName: string;
        result: import("@prisma/client/runtime/client").JsonValue;
        screenshotPath: string | null;
        timestamp: Date;
    })[]>;
    getEvidence(id: string): Promise<({
        gaps: ({
            control: {
                standard: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                standardId: string;
                code: string;
                description: string | null;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            details: string | null;
            controlId: string;
            evidenceId: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        source: string;
        resourceId: string | null;
        checkName: string;
        result: import("@prisma/client/runtime/client").JsonValue;
        screenshotPath: string | null;
        timestamp: Date;
    }) | null>;
}

import { EvidenceService } from './evidence.service';
export declare class EvidenceController {
    private readonly evidenceService;
    constructor(evidenceService: EvidenceService);
    getHistory(controlId: string): Promise<({
        gaps: {
            id: string;
            controlId: string;
            evidenceId: string;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            details: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        result: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        source: string;
        resourceId: string | null;
        checkName: string;
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
            controlId: string;
            evidenceId: string;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            details: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        result: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        source: string;
        resourceId: string | null;
        checkName: string;
        screenshotPath: string | null;
        timestamp: Date;
    }) | null>;
}

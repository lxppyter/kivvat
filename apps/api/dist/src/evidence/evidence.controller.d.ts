import { EvidenceService } from './evidence.service';
export declare class EvidenceController {
    private readonly evidenceService;
    constructor(evidenceService: EvidenceService);
    getHistory(controlId: string): Promise<({
        gaps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            details: string | null;
            controlId: string;
            evidenceId: string;
        }[];
    } & {
        id: string;
        result: import("@prisma/client/runtime/client").JsonValue;
        source: string;
        resourceId: string | null;
        checkName: string;
        screenshotPath: string | null;
        timestamp: Date;
        userId: string | null;
    })[]>;
    getEvidence(id: string): Promise<({
        gaps: ({
            control: {
                standard: {
                    id: string;
                    name: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                standardId: string;
                code: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            details: string | null;
            controlId: string;
            evidenceId: string;
        })[];
    } & {
        id: string;
        result: import("@prisma/client/runtime/client").JsonValue;
        source: string;
        resourceId: string | null;
        checkName: string;
        screenshotPath: string | null;
        timestamp: Date;
        userId: string | null;
    }) | null>;
}

import { PrismaService } from '../prisma/prisma.service';
import { ReportService } from '../report/report.service';
export declare class EvidenceService {
    private prisma;
    private reportService;
    constructor(prisma: PrismaService, reportService: ReportService);
    collectEvidence(provider: string): Promise<{
        id: string;
        result: import("@prisma/client/runtime/client").JsonValue;
        source: string;
        resourceId: string | null;
        checkName: string;
        screenshotPath: string | null;
        timestamp: Date;
    }>;
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
    }) | null>;
}

import { PrismaService } from '../prisma/prisma.service';
import { ReportService } from '../report/report.service';
export declare class EvidenceService {
    private prisma;
    private reportService;
    constructor(prisma: PrismaService, reportService: ReportService);
    collectEvidence(provider: string): Promise<{
        result: import("@prisma/client/runtime/client").JsonValue;
        id: string;
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
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                standardId: string;
                code: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
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
        result: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        source: string;
        resourceId: string | null;
        checkName: string;
        screenshotPath: string | null;
        timestamp: Date;
    }) | null>;
}

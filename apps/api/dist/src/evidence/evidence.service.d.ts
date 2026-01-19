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
            status: import("@prisma/client").$Enums.ComplianceStatus;
            createdAt: Date;
            details: string | null;
            updatedAt: Date;
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
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    description: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                standardId: string;
                code: string;
                description: string | null;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            createdAt: Date;
            details: string | null;
            updatedAt: Date;
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

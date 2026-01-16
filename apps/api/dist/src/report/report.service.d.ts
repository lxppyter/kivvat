import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class ReportService implements OnModuleInit {
    private prisma;
    private browser;
    private template;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    generateEvidenceScreenshot(evidence: any): Promise<string>;
    generateFullPdfReport(reportId: string): Promise<string>;
    onApplicationShutdown(): Promise<void>;
}

import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from '../task/task.service';
import { Evidence } from '@prisma/client';
export declare class AnalysisService {
    private prisma;
    private taskService;
    constructor(prisma: PrismaService, taskService: TaskService);
    analyzeEvidence(evidence: Evidence): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ComplianceStatus;
        details: string | null;
        controlId: string;
        evidenceId: string;
    }>;
}

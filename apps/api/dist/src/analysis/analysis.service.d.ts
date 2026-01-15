import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from '../task/task.service';
import { Evidence } from '@prisma/client';
export declare class AnalysisService {
    private prisma;
    private taskService;
    constructor(prisma: PrismaService, taskService: TaskService);
    analyzeEvidence(evidence: Evidence): Promise<{
        id: string;
        controlId: string;
        evidenceId: string;
        status: import("@prisma/client").$Enums.ComplianceStatus;
        details: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

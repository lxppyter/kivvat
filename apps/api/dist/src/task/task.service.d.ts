import { PrismaService } from '../prisma/prisma.service';
import { GapAnalysis } from '@prisma/client';
export declare class TaskService {
    private prisma;
    constructor(prisma: PrismaService);
    createRemediationTask(gap: GapAnalysis): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        dueDate: Date | null;
        assigneeId: string | null;
        gapAnalysisId: string | null;
    }>;
}

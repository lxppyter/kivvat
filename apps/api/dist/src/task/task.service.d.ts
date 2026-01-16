import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTaskDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        assigneeId: string | null;
        dueDate: Date | null;
        gapAnalysisId: string | null;
    }>;
    createRemediationTask(gap: any): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        assigneeId: string | null;
        dueDate: Date | null;
        gapAnalysisId: string | null;
    }>;
    findAll(): Promise<({
        gapAnalysis: ({
            control: {
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
        }) | null;
        assignee: {
            id: string;
            name: string | null;
            email: string;
        } | null;
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        assigneeId: string | null;
        dueDate: Date | null;
        gapAnalysisId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        gapAnalysis: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            details: string | null;
            controlId: string;
            evidenceId: string;
        } | null;
        assignee: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            hashedRefreshToken: string | null;
            companyName: string | null;
            role: string;
        } | null;
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        assigneeId: string | null;
        dueDate: Date | null;
        gapAnalysisId: string | null;
    }>;
    update(id: string, dto: UpdateTaskDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        assigneeId: string | null;
        dueDate: Date | null;
        gapAnalysisId: string | null;
    }>;
}

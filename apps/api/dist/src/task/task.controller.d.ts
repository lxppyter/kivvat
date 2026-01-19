import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(createTaskDto: CreateTaskDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        assigneeId: string | null;
        gapAnalysisId: string | null;
    }>;
    findAll(): Promise<({
        assignee: {
            id: string;
            name: string | null;
            email: string;
        } | null;
        gapAnalysis: ({
            control: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                standardId: string;
                code: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            createdAt: Date;
            updatedAt: Date;
            controlId: string;
            evidenceId: string;
            details: string | null;
        }) | null;
    } & {
        id: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        assigneeId: string | null;
        gapAnalysisId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        assignee: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            password: string;
            hashedRefreshToken: string | null;
            companyName: string | null;
            role: import("@prisma/client").$Enums.Role;
            plan: import("@prisma/client").$Enums.Plan;
            licenseKey: string | null;
            licenseExpiresAt: Date | null;
            subscriptionStatus: string | null;
        } | null;
        gapAnalysis: {
            id: string;
            status: import("@prisma/client").$Enums.ComplianceStatus;
            createdAt: Date;
            updatedAt: Date;
            controlId: string;
            evidenceId: string;
            details: string | null;
        } | null;
    } & {
        id: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        assigneeId: string | null;
        gapAnalysisId: string | null;
    }>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        assigneeId: string | null;
        gapAnalysisId: string | null;
    }>;
}

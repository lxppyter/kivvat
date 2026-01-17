import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(createTaskDto: CreateTaskDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        dueDate: Date | null;
        assigneeId: string | null;
        gapAnalysisId: string | null;
    }>;
    findAll(): Promise<({
        gapAnalysis: ({
            control: {
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
        dueDate: Date | null;
        assigneeId: string | null;
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
        dueDate: Date | null;
        assigneeId: string | null;
        gapAnalysisId: string | null;
    }>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TaskStatus;
        title: string;
        dueDate: Date | null;
        assigneeId: string | null;
        gapAnalysisId: string | null;
    }>;
}

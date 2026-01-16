import { TaskStatus } from '@prisma/client';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string;
    dueDate?: string;
}

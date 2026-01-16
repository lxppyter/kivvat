import { AwsScanner } from './aws.scanner';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from '../task/task.service';
import { ScanResult } from './scanner.interface';
export declare class ScannerService {
    private awsScanner;
    private prisma;
    private taskService;
    constructor(awsScanner: AwsScanner, prisma: PrismaService, taskService: TaskService);
    getReports(userId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        userId: string;
        provider: string;
        score: number;
        results: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    private getControlCode;
    runScan(provider: string, credentials: any, userId: string): Promise<ScanResult[]>;
    private verifyManualAssets;
    private processResults;
    syncAssets(userId: string, credentials: any): Promise<{
        count: number;
    }>;
    getAssets(userId: string): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        status: string | null;
        userId: string;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        type: string;
        provider: string;
        region: string | null;
    }[]>;
}

import { AwsScanner } from './aws.scanner';
import { AzureScanner } from './azure.scanner';
import { GcpScanner } from './gcp.scanner';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from '../task/task.service';
import { ScanResult } from './scanner.interface';
export declare const RULE_TO_CONTROLS_MAP: Record<string, string[]>;
export declare class ScannerService {
    private awsScanner;
    private azureScanner;
    private gcpScanner;
    private prisma;
    private taskService;
    constructor(awsScanner: AwsScanner, azureScanner: AzureScanner, gcpScanner: GcpScanner, prisma: PrismaService, taskService: TaskService);
    getReports(userId: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        provider: string;
        score: number;
        results: import("@prisma/client/runtime/client").JsonValue;
        userId: string;
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
        details: import("@prisma/client/runtime/client").JsonValue | null;
        region: string | null;
        type: string;
        provider: string;
        userId: string;
    }[]>;
}

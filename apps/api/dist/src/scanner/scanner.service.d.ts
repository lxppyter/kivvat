import { AwsScanner } from './aws.scanner';
import { AzureScanner } from './azure.scanner';
import { GcpScanner } from './gcp.scanner';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from '../task/task.service';
import { ScanResult } from './scanner.interface';
export declare const RULE_TO_CONTROLS_MAP: Record<string, string[]>;
export declare const RULE_TO_REMEDIATION_MAP: Record<string, string>;
export declare class ScannerService {
    private awsScanner;
    private azureScanner;
    private gcpScanner;
    private prisma;
    private taskService;
    constructor(awsScanner: AwsScanner, azureScanner: AzureScanner, gcpScanner: GcpScanner, prisma: PrismaService, taskService: TaskService);
    getReports(userId: string): Promise<{
        id: string;
        provider: string;
        score: number;
        status: string;
        results: import("@prisma/client/runtime/client").JsonValue;
        userId: string;
        createdAt: Date;
    }[]>;
    private getControlCode;
    private getRemediation;
    runScan(provider: string, credentials: any, userId: string, plan?: string): Promise<ScanResult[]>;
    private verifyManualAssets;
    private processResults;
    syncAssets(userId: string, credentials: any): Promise<{
        count: number;
    }>;
    getAssets(userId: string): Promise<{
        id: string;
        provider: string;
        status: string | null;
        userId: string;
        name: string;
        type: string;
        region: string | null;
        details: import("@prisma/client/runtime/client").JsonValue | null;
        updatedAt: Date;
    }[]>;
}

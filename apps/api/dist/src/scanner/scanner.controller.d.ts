import { ScannerService } from './scanner.service';
export declare class ScannerController {
    private readonly scannerService;
    constructor(scannerService: ScannerService);
    getReports(req: any): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        provider: string;
        score: number;
        results: import("@prisma/client/runtime/client").JsonValue;
        userId: string;
    }[]>;
    syncAssets(req: any, body: {
        credentials: any;
    }): Promise<{
        count: number;
    }>;
    getAssets(req: any): Promise<{
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
    runScan(body: {
        provider: string;
        credentials: any;
    }, req: any): Promise<import("./scanner.interface").ScanResult[]>;
}

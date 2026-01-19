import { ScannerService } from './scanner.service';
export declare class ScannerController {
    private readonly scannerService;
    constructor(scannerService: ScannerService);
    getReports(req: any): Promise<{
        id: string;
        provider: string;
        score: number;
        status: string;
        results: import("@prisma/client/runtime/client").JsonValue;
        userId: string;
        createdAt: Date;
    }[]>;
    syncAssets(req: any, body: {
        credentials: any;
    }): Promise<{
        count: number;
    }>;
    getAssets(req: any): Promise<{
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
    runScan(body: {
        provider: string;
        credentials: any;
    }, req: any): Promise<import("./scanner.interface").ScanResult[]>;
}

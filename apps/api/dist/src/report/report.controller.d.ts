import { ReportService } from './report.service';
import type { Response } from 'express';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    downloadPdf(id: string, res: Response): Promise<void>;
    downloadZipBundle(id: string, res: Response): Promise<void>;
}

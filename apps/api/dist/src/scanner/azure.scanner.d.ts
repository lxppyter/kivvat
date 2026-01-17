import { CloudScanner, ScanResult } from './scanner.interface';
export declare class AzureScanner implements CloudScanner {
    scan(credentials: any): Promise<ScanResult[]>;
    private listAll;
}

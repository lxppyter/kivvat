import { CloudScanner, ScanResult } from './scanner.interface';
export declare class AwsScanner implements CloudScanner {
    scan(credentials: any): Promise<ScanResult[]>;
    discoverAssets(credentials: any): Promise<any[]>;
}

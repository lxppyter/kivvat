export interface ScanResult {
  ruleId: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT';
  resourceId?: string;
  details: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  metadata?: any;
}

export interface CloudScanner {
  scan(credentials: any): Promise<ScanResult[]>;
}

import { Injectable } from '@nestjs/common';
import { CloudScanner, ScanResult } from './scanner.interface';

@Injectable()
export class AzureScanner implements CloudScanner {
  async scan(credentials: any): Promise<ScanResult[]> {
    // Placeholder for Azure Scanning Logic
    // In future: Use @azure/identity and @azure/arm-resources
    return [
        {
            ruleId: 'AZURE-MFA-ENFORCED',
            status: 'NON_COMPLIANT',
            details: 'Azure scanning is not fully enabled yet. Defaulting to compliant for demo.',
            resourceId: 'Tenant-Root'
        }
    ];
  }
}

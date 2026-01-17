// Mirrors the backend mapping in ScannerService
// ONE-TO-MANY MAPPING: A single technical rule maps to multiple compliance standards
export const RULE_TO_CONTROLS_MAP: Record<string, string[]> = {
  // --- AWS ---
  'AWS-IAM-ROOT-MFA':    ['A.9.4.2', 'CC6.1', 'TEKNIK.4', 'Req 8'],
  'AWS-IAM-MFA':         ['A.9.4.2', 'CC6.1', 'TEKNIK.4', 'Req 8'],
  'AWS-IAM-ROOT-KEYS':   ['A.9.2.3', 'CC6.1', 'TEKNIK.3'],
  'AWS-S3-ENCRYPTION':   ['A.10.1.1', 'CC6.7', 'TEKNIK.11', 'Req 3'],
  'AWS-S3-PUBLIC-BLOCK': ['A.13.1.1', 'CC6.6', 'TEKNIK.5', 'Req 1'],
  'AWS-EC2-OPEN-SSH':    ['A.13.1.1', 'CC6.6', 'TEKNIK.5', 'Req 1'],
  'AWS-EC2-OPEN-RDP':    ['A.13.1.1', 'CC6.6', 'TEKNIK.5', 'Req 1'],
  'AWS-RDS-ENCRYPTION':  ['A.10.1.1', 'CC6.1', 'TEKNIK.11', 'Req 3'],
  'AWS-CLOUDTRAIL':      ['A.12.4.1', 'CC7.2', 'TEKNIK.2', 'Req 10'],

  // --- AZURE ---
  'AZURE-STORAGE-SECURE-TRANSFER': ['A.10.1.1', 'CC6.7', 'TEKNIK.11'],
  'AZURE-STORAGE-NO-PUBLIC':       ['A.13.1.1', 'CC6.6', 'TEKNIK.5'],
  'AZURE-SQL-AUDITING':            ['A.12.4.1', 'CC7.2', 'TEKNIK.2'],
  'AZURE-SQL-TDE':                 ['A.10.1.1', 'CC6.1', 'TEKNIK.11'],
  'AZURE-SQL-FIREWALL':            ['A.13.1.1', 'CC6.6', 'TEKNIK.5'],
  'AZURE-VM-NSG-SSH':              ['A.13.1.1', 'CC6.6', 'TEKNIK.5'],
  'AZURE-VM-DISK-ENCRYPTION':      ['A.10.1.1', 'CC6.1', 'TEKNIK.11'],

  // --- GCP ---
  'GCP-STORAGE-PUBLIC-BLOCK':      ['A.13.1.1', 'CC6.6', 'TEKNIK.5'],
  'GCP-COMPUTE-NO-PUBLIC-IP':      ['A.13.1.1', 'CC6.6', 'TEKNIK.5'],
  'GCP-COMPUTE-SHIELDED':          ['A.12.1.2', 'CC6.8', 'TEKNIK.6'],
  'GCP-SQL-SSL':                   ['A.10.1.1', 'CC6.7', 'TEKNIK.11'],
  'GCP-IAM-NO-SERVICE-ACCOUNT-KEYS': ['A.9.2.3', 'CC6.1', 'TEKNIK.3'],

  // --- ENDPOINT ---
  'ENDPOINT-DISK-ENCRYPTION': ['A.10.1.1', 'CC6.1', 'TEKNIK.11'],
  'ENDPOINT-ANTIVIRUS':       ['A.12.2.1', 'CC6.8', 'TEKNIK.6'],
};

export const getStandardName = (code: string) => {
    if (code.startsWith('A.')) return 'ISO 27001';
    if (code.startsWith('CC')) return 'SOC 2 Type II';
    if (code.startsWith('Req')) return 'PCI DSS';
    if (code.startsWith('TEKNIK')) return 'KVKK / GDPR';
    return 'General Best Practice';
};

import { Injectable } from '@nestjs/common';
import { AwsScanner } from './aws.scanner';
import { AzureScanner } from './azure.scanner';
import { GcpScanner } from './gcp.scanner';
import { CloudService } from '../cloud/cloud.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from '../task/task.service';
import { ScanResult } from './scanner.interface';

// ONE-TO-MANY MAPPING: A single technical rule maps to multiple compliance standards
// Format: 'RULE-ID': ['ISO-CODE', 'SOC2-CODE', 'KVKK-CODE', 'PCI-CODE']
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
  'ENDPOINT-ANTIVIRUS':       ['A.12.2.1', 'CC6.8', 'TEKNIK.6'],
};

export const RULE_TO_REMEDIATION_MAP: Record<string, string> = {
  // --- AWS ---
  'AWS-IAM-ROOT-MFA':    'Root kullanıcısı için MFA (Çok Faktörlü Kimlik Doğrulama) etkinleştirin. AWS Konsol > IAM > Dashboard üzerinden "Activate MFA on your root account" seçeneğini kullanın.',
  'AWS-IAM-MFA':         'IAM kullanıcıları için MFA zorunluluğu getirin. IAM Policy editor kullanarak "ForceMFA" politikasını tüm kullanıcılara uygulayın.',
  'AWS-IAM-ROOT-KEYS':   'Root kullanıcısı için oluşturulmuş Access Key\'leri silin. Root hesabı sadece acil durumlarda konsol erişimi için kullanılmalıdır, API erişimi için IAM User kullanın.',
  'AWS-S3-ENCRYPTION':   'S3 bucket özelliklerinden "Default Encryption" (SSE-S3 veya KMS) özelliğini açın. Mevcut objeleri şifrelemek için Batch Operations kullanabilirsiniz.',
  'AWS-S3-PUBLIC-BLOCK': 'S3 bucket izinlerinden "Block Public Access" ayarlarının (4 tik) tamamını açın. Public erişim gereken dosyalar için CloudFront OAI/OAC kullanın.',
  'AWS-EC2-OPEN-SSH':    'Security Group ayarlarından 22 (SSH) portunu 0.0.0.0/0 (Tüm Dünya) erişimine kapatın. Sadece şirket VPN IP\'nize veya Bastion Host\'a izin verin.',
  'AWS-EC2-OPEN-RDP':    'Security Group üzerinden 3389 (RDP) portunu genele kapatın. SSM Session Manager veya VPN kullanarak güvenli erişim sağlayın.',
  'AWS-RDS-ENCRYPTION':  'RDS veritabanı oluştururken "Enable Encryption" seçeneğini işaretleyin. Mevcut şifresiz DB\'ler için Snapshot alıp, şifreli olarak restore etmeniz gerekir.',
  'AWS-CLOUDTRAIL':      'Tüm regionlar için CloudTrail loglamasını etkinleştirin ve logları güvenli bir S3 bucket\'ına yönlendirin.',

  // --- AZURE ---
  'AZURE-STORAGE-SECURE-TRANSFER': 'Storage Account ayarlarından "Secure transfer required" özelliğini etkinleştirin. Bu sadece HTTPS üzerinden erişime izin verir.',
  'AZURE-STORAGE-NO-PUBLIC':       'Storage Account > Networking sekmesinden "Allow Blob public access" seçeneğini devre dışı (Disabled) bırakın.',
  'AZURE-SQL-AUDITING':            'Azure SQL Sunucusu için "Auditing" özelliğini açın ve logları Log Analytics veya Storage Account\'a gönderin.',
  'AZURE-SQL-TDE':                 'Azure SQL veritabanı için Transparent Data Encryption (TDE) özelliğini ON konumuna getirin.',
  'AZURE-SQL-FIREWALL':            'Veritabanı güvenlik duvarı kurallarında "Allow Azure services and resources to access this server" seçeneğini kapatın ve sadece belirli IP\'lere izin verin.',
  'AZURE-VM-NSG-SSH':              'NSG (Network Security Group) kurallarında 22 portunu internete kapatın. Just-In-Time (JIT) VM Access özelliğini kullanın.',
  'AZURE-VM-DISK-ENCRYPTION':      'Virtual Machine diskleri için Azure Disk Encryption (ADE) veya Server-side encryption with CMK etkinleştirin.',

  // --- GCP ---
  'GCP-STORAGE-PUBLIC-BLOCK':      'GCP Bucket izinlerinde "allUsers" veya "allAuthenticatedUsers" yetkilerini kaldırın. "Enforce public access prevention" seçeneğini açın.',
  'GCP-COMPUTE-NO-PUBLIC-IP':      'Compute Engine instance\'larından gerekli olmayan Public IP adreslerini kaldırın. Dışarı çıkış için Cloud NAT kullanın.',
  'GCP-COMPUTE-SHIELDED':          'VM oluştururken "Shielded VM" özelliklerini (Secure Boot, vTPM) etkinleştirin.',
  'GCP-SQL-SSL':                   'Cloud SQL instance ayarlarından "Allow only SSL connections" seçeneğini aktif hale getirin.',
  'GCP-IAM-NO-SERVICE-ACCOUNT-KEYS': 'Service Account Key oluşturulmasını Organization Policy (iam.disableServiceAccountKeyCreation) ile engelleyin. Workload Identity Federation kullanın.',

  // --- ENDPOINT ---
  'ENDPOINT-DISK-ENCRYPTION': 'Cihaz üzerinde BitLocker (Windows) veya FileVault (macOS) şifrelemesini etkinleştirin. Recovery key\'i güvenli bir yerde saklayın.',
  'ENDPOINT-ANTIVIRUS':       'Kurumsal antivirüs / EDR çözümünün yüklü ve aktif olduğundan emin olun. Son tarama tarihini kontrol edin.',
};

@Injectable()
export class ScannerService {
  constructor(
    private awsScanner: AwsScanner,
    private azureScanner: AzureScanner,
    private gcpScanner: GcpScanner,
    private prisma: PrismaService,
    private taskService: TaskService
  ) {}

  async getReports(userId: string) {
    return this.prisma.scanReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  // --- Rule Mapping Logic ---
  private getControlCode(ruleId: string): string[] {
    return RULE_TO_CONTROLS_MAP[ruleId] || [];
  }

  private getRemediation(ruleId: string): string | undefined {
    return RULE_TO_REMEDIATION_MAP[ruleId];
  }



  async runScan(provider: string, credentials: any, userId: string, plan: string = 'ENTERPRISE') {
    try {
      console.log(`Starting scan for user ${userId} with provider ${provider} [Plan: ${plan}]`);
      let results: ScanResult[] = [];

      // 1. Cloud Scan
      if (provider.toLowerCase() === 'aws') {
        results = await this.awsScanner.scan(credentials);
      } else if (provider.toLowerCase() === 'azure') {
        results = await this.azureScanner.scan(credentials);
      } else if (provider.toLowerCase() === 'gcp') {
        results = await this.gcpScanner.scan(credentials);
      }

      // 2. Manual Asset Verification (Endpoint Security)
      console.log('Verifying Physical Assets...');
      const manualResults = await this.verifyManualAssets(userId);
      console.log(`Found ${manualResults.length} manual asset issues/checks.`);
      results = [...results, ...manualResults];

      // Process Results: Inject Remediation & Save Evidence
      results = results.map(r => ({
          ...r,
          remediation: r.status === 'NON_COMPLIANT' ? this.getRemediation(r.ruleId) : undefined
      }));

      await this.processResults(results, plan);
      
      // Save Scan Report (Evidence-Auto)
      const passCount = results.filter(r => r.status === 'COMPLIANT').length;
      const total = results.length;
      const score = total > 0 ? Math.round((passCount / total) * 100) : 0;
      
      await this.prisma.scanReport.create({
          data: {
              provider,
              score,
              status: 'COMPLETED',
              results: results as any,
              userId,
          }
      });

      return results;
    } catch (e) {
      console.error('CRITICAL SCAN ERROR:', e);
      throw e;
    }
  }

  private async verifyManualAssets(userId: string): Promise<ScanResult[]> {
      const results: ScanResult[] = [];
      let assets = await this.prisma.asset.findMany({
          where: { 
              userId,
              provider: { in: ['ENDPOINT', 'ON_PREM'] }
          }
      });

      // If user has no assets, return empty result (No auto-seed)
      if (assets.length === 0) {
          console.log('User has no manual assets. Skipping manual verification.');
          return [];
      }

      for (const asset of assets) {
          const details: any = asset.details || {};
          
          // Check BitLocker / Disk Encryption
          if (details.bitlocker === true) {
              results.push({
                  ruleId: 'ENDPOINT-DISK-ENCRYPTION',
                  status: 'COMPLIANT',
                  resourceId: asset.name,
                  details: `Disk encryption (BitLocker/FileVault) is ENABLED on ${asset.name}.`,
                  severity: 'HIGH'
              });
          } else {
               results.push({
                  ruleId: 'ENDPOINT-DISK-ENCRYPTION',
                  status: 'NON_COMPLIANT',
                  resourceId: asset.name,
                  details: `Disk encryption is DISABLED on ${asset.name}. Device is at risk of physical data theft.`,
                  severity: 'HIGH'
              });
          }

          // Check Antivirus
          if (details.antivirus === true) {
               results.push({
                  ruleId: 'ENDPOINT-ANTIVIRUS',
                  status: 'COMPLIANT',
                  resourceId: asset.name,
                  details: `Antivirus/EDR solution is ENABLED on ${asset.name}.`,
                  severity: 'MEDIUM'
              });
          } else {
               results.push({
                  ruleId: 'ENDPOINT-ANTIVIRUS',
                  status: 'NON_COMPLIANT',
                  resourceId: asset.name,
                  details: `Antivirus protection is MISSING on ${asset.name}.`,
                  severity: 'MEDIUM'
              });
          }
      }

      return results;
  }

  private async processResults(results: ScanResult[], plan: string) {
    // ONE-TO-MANY VALIDATION: Check each result against multiple standards
    for (const res of results) {
        const mappedCodes = this.getControlCode(res.ruleId);
        
        if (mappedCodes.length === 0) {
            // Optional: Log unmapped rules
            continue; 
        }

        // Iterate through all mapped standards (ISO, SOC, KVKK, PCI)
        for (const code of mappedCodes) {
            // PLAN BASED FILTERING
            // CORE: Allows only 'TEKNIK' (KVKK)
            if (plan === 'CORE' && !code.startsWith('TEKNIK')) continue;
            // PRO: Allows 'TEKNIK', 'A' (ISO), 'CC' (SOC)
            if (plan === 'PRO' && !code.startsWith('TEKNIK') && !code.startsWith('A') && !code.startsWith('CC')) continue;
            
            const control = await this.prisma.control.findFirst({
                where: { code: code },
                include: { standard: true } // FIX: Include relation for standard definition
            });

            if (!control) {
                console.warn(`Control code ${code} not found in DB.`);
                continue;
            }

            // Create Evidence Linked to this specific Control
            // This populates the Gap Analysis for THAT standard
            const evidence = await this.prisma.evidence.create({
                data: {
                    source: 'Cloud-Guardian',
                    checkName: `${res.ruleId} (${res.resourceId})`,
                    resourceId: res.resourceId,
                    result: res as any,
                    gaps: {
                      create: {
                            status: res.status === 'COMPLIANT' ? 'COMPLIANT' : 'NON_COMPLIANT',
                            details: res.details,
                            control: {
                                 connect: { id: control.id } 
                            }
                      }
                    }
                },
                include: { gaps: true }
            });

            // Create Task ONLY if Non-Compliant
            if (res.status === 'NON_COMPLIANT' && evidence.gaps && evidence.gaps.length > 0) {
                const gap = evidence.gaps[0];
                const severityPrefix = res.severity ? `[${res.severity}] ` : '';
                
                // Avoid Duplicate Tasks (Check if open task exists for this gap)
                // FIX: Use 'CLOSED' instead of 'COMPLETED' based on Schema
                const existingTask = await this.prisma.task.findFirst({
                    where: { gapAnalysisId: gap.id, status: { not: 'CLOSED' } } 
                });

                if (!existingTask) {
                    await this.prisma.task.create({
                      data: {
                        title: `${severityPrefix}Düzelt: ${res.ruleId}`,
                        description: `Gereken İyileştirme: ${control.code} (${control.standard?.name || 'Standart'}) uyumluluğu için aksiyon alınmalı.\n\nTespit: ${res.details}`,
                        gapAnalysisId: gap.id,
                        status: 'OPEN',
                      },
                    });
                }
            }
        }
    }
  }

  async syncAssets(userId: string, credentials: any) {
    const assets = await this.awsScanner.discoverAssets(credentials);
    
    // Clear old assets for this user
    await this.prisma.asset.deleteMany({ where: { userId } });

    // Insert new assets
    for (const asset of assets) {
      // Clean up undefined values to avoid Prisma errors
      const cleanAsset = {
          provider: asset.provider,
          type: asset.type,
          name: asset.name,
          region: asset.region || 'global',
          status: asset.status || 'UNKNOWN',
          details: asset.details || {},
          userId,
      };

      await this.prisma.asset.create({
        data: cleanAsset,
      });
    }
    
    return { count: assets.length };
  }

  async getAssets(userId: string) {
    return this.prisma.asset.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }
}

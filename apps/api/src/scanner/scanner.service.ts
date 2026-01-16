import { Injectable } from '@nestjs/common';
import { AwsScanner } from './aws.scanner';
import { CloudService } from '../cloud/cloud.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from '../task/task.service';
import { ScanResult } from './scanner.interface';

@Injectable()
export class ScannerService {
  constructor(
    private awsScanner: AwsScanner,
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
  private getControlCode(ruleId: string): string | null {
    const RULE_TO_CONTROL_MAP: Record<string, string> = {
      // AWS IAM
      'AWS-IAM-ROOT-MFA': 'A.9.1.1',
      'AWS-IAM-ROOT-KEYS': 'A.9.4.1', 
      'AWS-IAM-GHOST-USER': 'A.9.2.1',
      // AWS S3
      'AWS-S3-ENCRYPTION': 'A.10.1.1',
      'AWS-S3-PUBLIC-BLOCK': 'A.13.1.1',
      // AWS EC2
      'AWS-EC2-OPEN-SSH': 'A.13.1.1',
      'AWS-EC2-OPEN-RDP': 'A.13.1.1',
      // ENDPOINT (Manual Verification)
      'ENDPOINT-DISK-ENCRYPTION': 'A.10.1.1', // Cryptographic controls
      'ENDPOINT-ANTIVIRUS': 'A.12.2.1',       // Malware protection
    };
    return RULE_TO_CONTROL_MAP[ruleId] || null;
  }

  async runScan(provider: string, credentials: any, userId: string) {
    try {
      console.log(`Starting scan for user ${userId} with provider ${provider}`);
      let results: ScanResult[] = [];

      // 1. Cloud Scan
      if (provider.toLowerCase() === 'aws') {
        results = await this.awsScanner.scan(credentials);
      }

      // 2. Manual Asset Verification (Endpoint Security)
      console.log('Verifying Physical Assets...');
      const manualResults = await this.verifyManualAssets(userId);
      console.log(`Found ${manualResults.length} manual asset issues/checks.`);
      results = [...results, ...manualResults];

      // Process Results: Save Evidence & Create Tasks
      await this.processResults(results);
      
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

      // AUTO-SEED: If user has no assets, create demo data for immediate value
      if (assets.length === 0) {
          console.log('User has no assets. Seeding demo data...');
          await this.prisma.asset.createMany({
            data: [
                {
                    userId,
                    name: 'Demo-Laptop-Finans',
                    type: 'WORKSTATION',
                    provider: 'ENDPOINT',
                    status: 'ACTIVE',
                    details: { bitlocker: true, antivirus: false, serialNumber: 'DEMO-111' } // Risk: No AV
                },
                {
                    userId,
                    name: 'Demo-Server-DB',
                    type: 'SERVER',
                    provider: 'ON_PREM',
                    status: 'ACTIVE',
                    details: { bitlocker: false, antivirus: true, ip: '192.168.1.50' } // Risk: No Encryption
                },
                {
                    userId,
                    name: 'Demo-CEO-Macbook',
                    type: 'WORKSTATION',
                    provider: 'ENDPOINT',
                    status: 'ACTIVE',
                    details: { bitlocker: true, antivirus: true, serialNumber: 'DEMO-999' } // Safe
                }
            ]
          });
          // Re-fetch
          assets = await this.prisma.asset.findMany({
            where: { userId, provider: { in: ['ENDPOINT', 'ON_PREM'] } }
          });
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

  private async processResults(results: ScanResult[]) {
    // Cache default control to avoid repeated DB calls if no mapping found
    const defaultControl = await this.prisma.control.findFirst();

    for (const res of results) {
        // 1. Find correct Control via Mapping
        let targetControlId = defaultControl?.id;
        const mappedCode = this.getControlCode(res.ruleId);
        
        if (mappedCode) {
            const output = await this.prisma.control.findFirst({
                where: { code: mappedCode }
            });
            if (output) targetControlId = output.id;
        }

        if (!targetControlId) {
            console.warn('No controls found in DB. Cannot link evidence.');
            continue;
        }

        // 2. Create Evidence
        const evidence = await this.prisma.evidence.create({
            data: {
                source: 'Cloud-Guardian',
                checkName: res.ruleId,
                resourceId: res.resourceId,
                result: res as any,
                gaps: {
                  create: {
                        status: res.status === 'COMPLIANT' ? 'COMPLIANT' : 'NON_COMPLIANT',
                        details: res.details,
                        control: {
                             connect: { id: targetControlId } 
                        }
                  }
                }
            },
            include: { gaps: true }
        });

        // 3. Create Task if Non-Compliant
        if (res.status === 'NON_COMPLIANT' && evidence.gaps && evidence.gaps.length > 0) {
            const gap = evidence.gaps[0];
            const severityPrefix = res.severity ? `[${res.severity}] ` : '';
            
            await this.prisma.task.create({
              data: {
                title: `${severityPrefix}Fix ${res.ruleId}`,
                description: `Automated remediation task for control ${mappedCode || 'Unknown'}. Detail: ${res.details}. Resource: ${res.resourceId || 'N/A'}`,
                gapAnalysisId: gap.id,
                status: 'OPEN',
              },
            });
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

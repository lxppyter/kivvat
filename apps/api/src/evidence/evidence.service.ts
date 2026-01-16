import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportService } from '../report/report.service';

@Injectable()
export class EvidenceService {
  constructor(private prisma: PrismaService, private reportService: ReportService) {}

  async collectEvidence(provider: string) {
    // Mock check: S3 Public Access
    const mockResult = {
      status: 'NON_COMPLIANT',
      details: 'Bucket kivvat-sensitive-data has Public Access Block DISABLED.',
      resourceId: 'kivvat-sensitive-data',
      severity: 'HIGH'
    };

    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 1. Save raw evidence
    const evidence = await this.prisma.evidence.create({
      data: {
        source: provider,
        checkName: 'S3 Public Access Check',
        resourceId: mockResult.resourceId,
        result: mockResult,
      },
    });

    // 2. Generate Visual Evidence (Screenshot)
    try {
      const screenshotPath = await this.reportService.generateEvidenceScreenshot(evidence);
      
      // 3. Update record with path
      const updated = await this.prisma.evidence.update({
        where: { id: evidence.id },
        data: { screenshotPath }
      });
      
      console.log(`[Evidence] Collected & Screenshot from ${provider}:`, updated);
      return updated;
    } catch (e) {
      console.error('Screenshot Failed:', e);
      return evidence;
    }
  }

  async getHistory(controlId: string) {
      return this.prisma.evidence.findMany({
          where: {
              gaps: {
                  some: {
                      controlId: controlId
                  }
              }
          },
          include: {
              gaps: true
          },
          orderBy: {
              timestamp: 'desc'
          },
          take: 10 // Limit history to last 10 scans
      });
  }

  async getEvidence(id: string) {
      return this.prisma.evidence.findUnique({
          where: { id },
          include: {
              gaps: {
                  include: {
                      control: {
                          include: {
                              standard: true
                          }
                      }
                  }
              }
          }
      });
  }
}

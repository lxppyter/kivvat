import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvidenceService {
  constructor(private prisma: PrismaService) {}

  async collectEvidence(provider: string) {
    // Mock check: S3 Public Access
    const mockResult = {
      bucketName: 'kivvat-sensitive-data',
      publicAccessBlock: false, // NON_COMPLIANT
    };

    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    const evidence = await this.prisma.evidence.create({
      data: {
        source: provider,
        checkName: 'S3 Public Access Check',
        result: mockResult,
      },
    });

    console.log(`[Evidence] Collected from ${provider}:`, evidence);
    return evidence;
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

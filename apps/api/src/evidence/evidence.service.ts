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
}

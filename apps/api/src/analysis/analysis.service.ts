import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from '../task/task.service';
import { Evidence, ComplianceStatus } from '@prisma/client';

@Injectable()
export class AnalysisService {
  constructor(
    private prisma: PrismaService,
    private taskService: TaskService,
  ) {}

  async analyzeEvidence(evidence: Evidence) {
    // 1. Find or Create relevant Control (Simulated mapping)
    // Normally this would be a lookup based on checkName -> Control ID
    let standard = await this.prisma.complianceStandard.findUnique({
      where: { name: 'ISO 27001' },
    });
    if (!standard) {
      standard = await this.prisma.complianceStandard.create({
        data: {
          name: 'ISO 27001',
          description: 'Information Security Management',
        },
      });
    }

    let control = await this.prisma.control.findFirst({
        where: { code: 'A.9.1' }
    });
    
    if (!control) {
        control = await this.prisma.control.create({
            data: {
                standardId: standard.id,
                code: 'A.9.1',
                name: 'Access Control',
                description: 'Limit access to information and information processing facilities.'
            }
        })
    }


    // 2. Evaluate Logic
    let status: ComplianceStatus = 'PENDING';
    let details = '';

    if (evidence.checkName === 'S3 Public Access Check') {
      const result = evidence.result as any;
      if (result.publicAccessBlock === false) {
        status = 'NON_COMPLIANT';
        details = `Bucket ${result.bucketName} is publicly accessible via ACLs or Policies.`;
      } else {
        status = 'COMPLIANT';
        details = `Bucket ${result.bucketName} is secure.`;
      }
    }

    // 3. Save Gap Analysis
    const gap = await this.prisma.gapAnalysis.create({
      data: {
        controlId: control.id,
        evidenceId: evidence.id,
        status: status,
        details: details,
      },
    });

    console.log(`[Analysis] Gap Created: ${status} for ${evidence.checkName}`);

    // 4. Trigger Task if Non-Compliant
    if (status === 'NON_COMPLIANT') {
      await this.taskService.createRemediationTask(gap);
    }

    return gap;
  }
}

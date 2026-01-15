import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GapAnalysis, TaskStatus } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createRemediationTask(gap: GapAnalysis) {
    const task = await this.prisma.task.create({
      data: {
        title: `Fix Compliance Issue: ${gap.evidenceId}`, // Simplified title
        description: `Gap detected: ${gap.details}. Please remediate immediately used standard control.`,
        gapAnalysisId: gap.id,
        status: TaskStatus.OPEN,
      },
    });
    console.log(`[Task] Remediation Task Created: ${task.id}`);
    return task;
  }
}

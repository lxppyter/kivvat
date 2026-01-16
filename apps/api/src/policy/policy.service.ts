import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PolicyService {
  constructor(private prisma: PrismaService) {}

  async getTemplates() {
    return this.prisma.policyTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAssignments(userId?: string) {
    const whereClause = userId ? { userId } : {};
    
    const assignments = await this.prisma.policyAssignment.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true } },
        policy: { select: { name: true, category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stats
    const total = assignments.length;
    const signed = assignments.filter((a) => a.status === 'SIGNED').length;
    const pending = assignments.filter((a) => a.status === 'PENDING').length;
    const overdue = assignments.filter((a) => a.status === 'OVERDUE').length;

    return {
      assignments,
      stats: {
        total,
        signed,
        pending,
        overdue,
        percentage: total > 0 ? Math.round((signed / total) * 100) : 0,
      },
    };
  }
  async signPolicy(assignmentId: string) {
    return this.prisma.policyAssignment.update({
      where: { id: assignmentId },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
      },
    });
  }

  async downloadTemplate(templateId: string, companyName: string) {
    const template = await this.prisma.policyTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    // Dynamic replacement
    const content = template.content.replace(/{{companyName}}/g, companyName);
    
    return {
      name: template.name,
      content,
    };
  }
}

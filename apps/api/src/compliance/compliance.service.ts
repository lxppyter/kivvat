import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const standards = await this.prisma.complianceStandard.findMany({
      include: {
        controls: {
          orderBy: { code: 'asc' },
          include: {
            gaps: {
              include: { evidence: true },
              where: {
                evidence: {
                   userId: userId
                }
              },
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return standards.map(std => {
       const mappedControls = std.controls.map(c => {
           // DEBUG LOGGING
           if (c.gaps.length > 0 && c.gaps[0].status === 'NON_COMPLIANT') {
               console.log(`[DEBUG] Found Non-Compliant Gap: Standard=${std.name}, Control=${c.code}, GapID=${c.gaps[0].id}`);
               console.log(`[DEBUG] Evidence Source: ${c.gaps[0].evidence?.source}`);
               console.log(`[DEBUG] Evidence ID: ${c.gaps[0].evidenceId}`);
           }
           
           return {
               id: c.id,
               code: c.code,
               name: c.name,
               description: c.description,
               status: c.gaps[0]?.status || 'UNSCANNED'
           };
       });

       const total = mappedControls.length;
       const passed = mappedControls.filter(c => c.status === 'COMPLIANT').length;
       const score = total > 0 ? Math.round((passed / total) * 100) : 0;

       const isAnalyzed = std.controls.some(c => c.gaps.length > 0);
       
       return {
           id: std.id,
           name: std.name,
           description: std.description,
           complianceScore: score,
           analyzed: isAnalyzed,
           controls: mappedControls
       };
    });
  }

  async getSummary() {
    // 1. Fetch all standards with their controls and gaps
    const standards = await this.prisma.complianceStandard.findMany({
      include: {
        controls: {
          include: {
            gaps: true, // Get gap analysis to check status
          },
        },
      },
    });

    // 2. Calculate stats
    return standards.map((std) => {
      const totalControls = std.controls.length;
      if (totalControls === 0) {
        return {
          id: std.id,
          name: std.name,
          description: std.description,
          progress: 0,
          status: 'N/A',
          controls: { passed: 0, total: 0 },
          lastAudit: std.updatedAt,
        };
      }

      let passedCount = 0;

      std.controls.forEach((ctrl) => {
        // Assume compliant if ANY gap analysis says COMPLIANT (or strictly ALL? Let's say latest)
        // For simplicity: if latest gap is COMPLIANT.
        const latestGap = ctrl.gaps[0]; // Simplified: assuming 1-1 or getting first
        if (latestGap && latestGap.status === 'COMPLIANT') {
          passedCount++;
        }
      });

      const progress = Math.round((passedCount / totalControls) * 100);
      
      let status = 'Riskli';
      if (progress >= 80) status = 'İyi Durumda';
      else if (progress >= 50) status = 'Geliştirilmeli';

      return {
        id: std.id,
        name: std.name,
        description: std.description,
        progress,
        status,
        controls: { passed: passedCount, total: totalControls },
        lastAudit: std.updatedAt,
      };
    });
  }
}

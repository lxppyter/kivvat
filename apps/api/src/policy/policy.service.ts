import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    // Lazy Assign: If userId is provided, ensure they have assignments for all policies
    if (userId) {
        const allPolicies = await this.prisma.policyTemplate.findMany({ select: { id: true } });
        const existingAssignments = await this.prisma.policyAssignment.findMany({
            where: { userId },
            select: { policyId: true }
        });
        
        const existingIds = new Set(existingAssignments.map(a => a.policyId));
        const missing = allPolicies.filter(p => !existingIds.has(p.id));
        
        if (missing.length > 0) {
            await this.prisma.policyAssignment.createMany({
                data: missing.map(p => ({
                    userId,
                    policyId: p.id,
                    status: 'PENDING'
                }))
            });
        }
    }

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

  async updatePolicy(id: string, newContent: string) {
    const policy = await this.prisma.policyTemplate.findUnique({ where: { id } });
    if (!policy) throw new Error('Policy not found');

    // Archive current version
    await this.prisma.policyVersion.create({
      data: {
        policyId: id,
        version: policy.version,
        content: policy.content,
      },
    });

    // Calc new version text (primitive increment 1.0 -> 1.1)
    const currentVer = parseFloat(policy.version) || 1.0;
    const newVer = (currentVer + 0.1).toFixed(1);

    // Update with new content and version
    return this.prisma.policyTemplate.update({
      where: { id },
      data: {
        content: newContent,
        version: newVer,
      },
    });
  }

  async getHistory(id: string) {
    return this.prisma.policyVersion.findMany({
      where: { policyId: id },
      orderBy: { createdAt: 'desc' },
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

  // --- Public Team Sharing Logic ---

  async createShareLink(policyId?: string, expiresAt?: Date | string, creatorId?: string) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Check if valid active share exists for this creator
    if (!expiresAt) {
        const existing = await this.prisma.policyShare.findFirst({
            where: {
                policyId: policyId || null,
                creatorId: creatorId || null, // Check per tenant
                active: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            } as any,
            orderBy: { createdAt: 'desc' }
        });

        if (existing) {
            return {
                token: existing.token,
                url: policyId 
                    ? `${baseUrl}/public/policy/${existing.token}` 
                    : `${baseUrl}/public/portal/${existing.token}`
            };
        }
    }

    // Generate new
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    await this.prisma.policyShare.create({
      data: {
        token,
        policyId: policyId || undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
        creatorId,
      } as any
    });

    return { 
        token, 
        url: policyId 
            ? `${baseUrl}/public/policy/${token}` 
            : `${baseUrl}/public/portal/${token}`
    };
  }

  async getPublicPolicy(token: string) {
    const share = await this.prisma.policyShare.findUnique({
      where: { token },
      include: { policy: true }
    });

    if (!share || !share.active) throw new NotFoundException("Link invalid or expired");
    if (share.expiresAt && share.expiresAt < new Date()) throw new BadRequestException("Link expired");

    // PORTAL MODE (Share All)
    if (!share.policyId) {
        // Fetch all templates (assuming single tenant/company for now)
        const allPolicies = await this.prisma.policyTemplate.findMany({
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, category: true, version: true, content: true }
        });
        return {
            type: 'PORTAL',
            policies: allPolicies
        };
    }

    // SINGLE MODE
    return {
        type: 'SINGLE',
        policy: share.policy
    };
  }

  async signPublicPolicy(token: string, signerName: string, signerEmail: string, policyId?: string, ip?: string, userAgent?: string) {
    const share = await this.prisma.policyShare.findUnique({ where: { token } });
    if (!share) throw new Error("Invalid token");

    // Determine target policy
    const targetPolicyId = share.policyId || policyId;
    if (!targetPolicyId) throw new Error("Policy ID required for portal signing");

    // Check if duplicate signature? (Optional)
    const existing = await this.prisma.policyAssignment.findFirst({
        where: {
            policyId: targetPolicyId,
            signerEmail: signerEmail,
            status: 'SIGNED'
        }
    });

    // If already signed, maybe just update signedAt or ignore?
    if (existing) {
        return this.prisma.policyAssignment.update({
            where: { id: existing.id },
            data: { signedAt: new Date(), signerName } // Update name if changed
        });
    }
    
    return this.prisma.policyAssignment.create({
      data: {
        policyId: targetPolicyId,
        userId: null, // Public signer
        signerName,
        signerEmail,
        status: 'SIGNED',
        signedAt: new Date(),
        ownerId: (share as any).creatorId, // Link to tenant
        ipAddress: ip,
        userAgent: userAgent
      } as any
    });
  }


  async getShares(userId: string) {
    return this.prisma.policyShare.findMany({
      where: { active: true, creatorId: userId },
      include: { policy: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async revokeShare(id: string) {
    return this.prisma.policyShare.update({
      where: { id },
      data: { active: false }
    });
  }
}

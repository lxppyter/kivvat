"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PolicyService = class PolicyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTemplates() {
        return this.prisma.policyTemplate.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAssignments(userId) {
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
    async signPolicy(assignmentId) {
        return this.prisma.policyAssignment.update({
            where: { id: assignmentId },
            data: {
                status: 'SIGNED',
                signedAt: new Date(),
            },
        });
    }
    async updatePolicy(id, newContent) {
        const policy = await this.prisma.policyTemplate.findUnique({ where: { id } });
        if (!policy)
            throw new Error('Policy not found');
        await this.prisma.policyVersion.create({
            data: {
                policyId: id,
                version: policy.version,
                content: policy.content,
            },
        });
        const currentVer = parseFloat(policy.version) || 1.0;
        const newVer = (currentVer + 0.1).toFixed(1);
        return this.prisma.policyTemplate.update({
            where: { id },
            data: {
                content: newContent,
                version: newVer,
            },
        });
    }
    async getHistory(id) {
        return this.prisma.policyVersion.findMany({
            where: { policyId: id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async downloadTemplate(templateId, companyName) {
        const template = await this.prisma.policyTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            throw new Error('Template not found');
        }
        const content = template.content.replace(/{{companyName}}/g, companyName);
        return {
            name: template.name,
            content,
        };
    }
    async createShareLink(policyId, expiresAt, creatorId) {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        if (!expiresAt) {
            const existing = await this.prisma.policyShare.findFirst({
                where: {
                    policyId: policyId || null,
                    creatorId: creatorId || null,
                    active: true,
                    OR: [
                        { expiresAt: null },
                        { expiresAt: { gt: new Date() } }
                    ]
                },
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
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await this.prisma.policyShare.create({
            data: {
                token,
                policyId: policyId || undefined,
                expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                creatorId,
            }
        });
        return {
            token,
            url: policyId
                ? `${baseUrl}/public/policy/${token}`
                : `${baseUrl}/public/portal/${token}`
        };
    }
    async getPublicPolicy(token) {
        const share = await this.prisma.policyShare.findUnique({
            where: { token },
            include: { policy: true }
        });
        if (!share || !share.active)
            throw new common_1.NotFoundException("Link invalid or expired");
        if (share.expiresAt && share.expiresAt < new Date())
            throw new common_1.BadRequestException("Link expired");
        if (!share.policyId) {
            const allPolicies = await this.prisma.policyTemplate.findMany({
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, category: true, version: true, content: true }
            });
            return {
                type: 'PORTAL',
                policies: allPolicies
            };
        }
        return {
            type: 'SINGLE',
            policy: share.policy
        };
    }
    async signPublicPolicy(token, signerName, signerEmail, policyId, ip, userAgent) {
        const share = await this.prisma.policyShare.findUnique({ where: { token } });
        if (!share)
            throw new Error("Invalid token");
        const targetPolicyId = share.policyId || policyId;
        if (!targetPolicyId)
            throw new Error("Policy ID required for portal signing");
        const existing = await this.prisma.policyAssignment.findFirst({
            where: {
                policyId: targetPolicyId,
                signerEmail: signerEmail,
                status: 'SIGNED'
            }
        });
        if (existing) {
            return this.prisma.policyAssignment.update({
                where: { id: existing.id },
                data: { signedAt: new Date(), signerName }
            });
        }
        return this.prisma.policyAssignment.create({
            data: {
                policyId: targetPolicyId,
                userId: null,
                signerName,
                signerEmail,
                status: 'SIGNED',
                signedAt: new Date(),
                ownerId: share.creatorId,
                ipAddress: ip,
                userAgent: userAgent
            }
        });
    }
    async getShares(userId) {
        return this.prisma.policyShare.findMany({
            where: { active: true, creatorId: userId },
            include: { policy: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async revokeShare(id) {
        return this.prisma.policyShare.update({
            where: { id },
            data: { active: false }
        });
    }
};
exports.PolicyService = PolicyService;
exports.PolicyService = PolicyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PolicyService);
//# sourceMappingURL=policy.service.js.map
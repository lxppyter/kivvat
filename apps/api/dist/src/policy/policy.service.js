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
};
exports.PolicyService = PolicyService;
exports.PolicyService = PolicyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PolicyService);
//# sourceMappingURL=policy.service.js.map
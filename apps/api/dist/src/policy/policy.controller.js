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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyController = void 0;
const common_1 = require("@nestjs/common");
const policy_service_1 = require("./policy.service");
const passport_1 = require("@nestjs/passport");
const prisma_service_1 = require("../prisma/prisma.service");
const subscription_guard_1 = require("../common/guards/subscription.guard");
let PolicyController = class PolicyController {
    policyService;
    prisma;
    constructor(policyService, prisma) {
        this.policyService = policyService;
        this.prisma = prisma;
    }
    async getTemplates() {
        return this.policyService.getTemplates();
    }
    async getAssignments(userId) {
        return this.policyService.getAssignments(userId);
    }
    async downloadTemplate(id, companyName) {
        return this.policyService.downloadTemplate(id, companyName || 'ACME Corp');
    }
    async signPolicy(id) {
        return this.policyService.signPolicy(id);
    }
    async getSignaturesStatus() {
        const users = await this.prisma.user.findMany({
            include: {
                policyAssignments: {
                    include: { policy: true }
                }
            }
        });
        const publicSignatures = await this.prisma.policyAssignment.findMany({
            where: { userId: null },
            include: { policy: true }
        });
        const totalPoliciesCount = await this.prisma.policyTemplate.count();
        const userStats = users.map(u => ({
            id: u.id,
            name: u.name || u.email,
            email: u.email,
            role: u.role,
            signedCount: u.policyAssignments.filter(pa => pa.status === 'SIGNED').length,
            totalPolicies: totalPoliciesCount,
            lastSigned: u.policyAssignments.length > 0 ? u.policyAssignments[0].signedAt : null,
            status: u.policyAssignments.filter(pa => pa.status === 'SIGNED').length >= totalPoliciesCount ? 'COMPLIANT' : 'PENDING'
        }));
        const publicSignersMap = new Map();
        publicSignatures.forEach((ps) => {
            const email = ps.signerEmail || 'Unknown';
            if (!publicSignersMap.has(email)) {
                publicSignersMap.set(email, {
                    name: ps.signerName || 'Guest',
                    email: email,
                    assignments: []
                });
            }
            publicSignersMap.get(email).assignments.push(ps);
        });
        const publicStats = Array.from(publicSignersMap.values()).map(singer => {
            const distinctSigned = new Set(singer.assignments.map(a => a.policyId)).size;
            return {
                id: singer.email,
                name: singer.name,
                email: singer.email,
                role: 'GUEST',
                signedCount: distinctSigned,
                totalPolicies: totalPoliciesCount,
                lastSigned: singer.assignments.sort((a, b) => b.signedAt.getTime() - a.signedAt.getTime())[0]?.signedAt,
                status: distinctSigned >= totalPoliciesCount ? 'COMPLIANT' : 'PENDING'
            };
        });
        return [...userStats, ...publicStats];
    }
    async updatePolicy(id, content) {
        return this.policyService.updatePolicy(id, content);
    }
    async getHistory(id) {
        return this.policyService.getHistory(id);
    }
    async getShares() {
        return this.policyService.getShares();
    }
    async revokeShare(id) {
        return this.policyService.revokeShare(id);
    }
    async createShareAllLink(body) {
        return this.policyService.createShareLink(undefined, body?.expiresAt);
    }
    async createShareLink(id, body) {
        return this.policyService.createShareLink(id, body?.expiresAt);
    }
    async getPublicPolicy(token) {
        return this.policyService.getPublicPolicy(token);
    }
    async signPublicPolicy(token, body) {
        return this.policyService.signPublicPolicy(token, body.name, body.email, body.policyId);
    }
};
exports.PolicyController = PolicyController;
__decorate([
    (0, common_1.Get)('templates'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('assignments'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getAssignments", null);
__decorate([
    (0, common_1.Get)('download/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "downloadTemplate", null);
__decorate([
    (0, common_1.Post)('sign/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "signPolicy", null);
__decorate([
    (0, common_1.Get)('signatures'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getSignaturesStatus", null);
__decorate([
    (0, common_1.Post)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "updatePolicy", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('shares'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getShares", null);
__decorate([
    (0, common_1.Delete)('share/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "revokeShare", null);
__decorate([
    (0, common_1.Post)('share/all'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "createShareAllLink", null);
__decorate([
    (0, common_1.Post)(':id/share'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "createShareLink", null);
__decorate([
    (0, common_1.Get)('public/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getPublicPolicy", null);
__decorate([
    (0, common_1.Post)('public/:token/sign'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "signPublicPolicy", null);
exports.PolicyController = PolicyController = __decorate([
    (0, common_1.Controller)('policies'),
    __metadata("design:paramtypes", [policy_service_1.PolicyService,
        prisma_service_1.PrismaService])
], PolicyController);
//# sourceMappingURL=policy.controller.js.map
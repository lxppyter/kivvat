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
    async getAssignments(req, queryUserId) {
        const user = req.user;
        const targetId = (user.role === 'ADMIN' || user.role === 'AUDITOR') && queryUserId
            ? queryUserId
            : (user.userId || user.id);
        return this.policyService.getAssignments(targetId);
    }
    async downloadTemplate(id, companyName) {
        return this.policyService.downloadTemplate(id, companyName || 'ACME Corp');
    }
    async signPolicy(id) {
        return this.policyService.signPolicy(id);
    }
    async getSignaturesStatus(req) {
        const user = req.user;
        const userId = user.userId || user.id;
        const usersWhere = (user.role === 'ADMIN' || user.role === 'AUDITOR')
            ? {}
            : { id: userId };
        const users = await this.prisma.user.findMany({
            where: usersWhere,
            include: {
                policyAssignments: {
                    include: { policy: true },
                    where: { status: 'SIGNED' }
                }
            }
        });
        let publicSignaturesWhere = { userId: null };
        if (user.role !== 'ADMIN' && user.role !== 'AUDITOR') {
            publicSignaturesWhere['ownerId'] = userId;
        }
        const publicSignatures = await this.prisma.policyAssignment.findMany({
            where: publicSignaturesWhere,
            include: { policy: true }
        });
        const totalPoliciesCount = await this.prisma.policyTemplate.count();
        const userStats = users.map(u => {
            const signedAssignments = u.policyAssignments.filter(pa => pa.status === 'SIGNED');
            const lastAssignment = signedAssignments.sort((a, b) => (b.signedAt?.getTime() || 0) - (a.signedAt?.getTime() || 0))[0];
            return {
                id: u.id,
                name: u.name || u.email,
                email: u.email,
                role: u.role,
                signedCount: signedAssignments.length,
                totalPolicies: totalPoliciesCount,
                lastSigned: lastAssignment?.signedAt,
                lastIp: lastAssignment?.ipAddress,
                lastUserAgent: lastAssignment?.userAgent,
                status: signedAssignments.length >= totalPoliciesCount ? 'COMPLIANT' : 'PENDING'
            };
        });
        const emailToUserMap = new Map();
        userStats.forEach(u => {
            if (u.email)
                emailToUserMap.set(u.email, u);
        });
        const publicSignersMap = new Map();
        publicSignatures.forEach((ps) => {
            const email = ps.signerEmail || 'Unknown';
            if (emailToUserMap.has(email)) {
                const userStat = emailToUserMap.get(email);
                userStat.signedCount += 1;
                const psDate = new Date(ps.signedAt).getTime();
                const userDate = userStat.lastSigned ? new Date(userStat.lastSigned).getTime() : 0;
                if (psDate > userDate) {
                    userStat.lastSigned = ps.signedAt;
                    userStat.lastIp = ps.ipAddress;
                    userStat.lastUserAgent = ps.userAgent;
                }
                if (userStat.signedCount >= userStat.totalPolicies) {
                    userStat.status = 'COMPLIANT';
                }
                return;
            }
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
            const lastAssignment = singer.assignments.sort((a, b) => new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime())[0];
            return {
                id: singer.email,
                name: singer.name,
                email: singer.email,
                role: 'GUEST',
                signedCount: distinctSigned,
                totalPolicies: totalPoliciesCount,
                lastSigned: lastAssignment?.signedAt,
                lastIp: lastAssignment?.ipAddress,
                lastUserAgent: lastAssignment?.userAgent,
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
    async getShares(req) {
        return this.policyService.getShares(req.user.userId || req.user.id);
    }
    async revokeShare(id) {
        return this.policyService.revokeShare(id);
    }
    async createShareAllLink(req, body) {
        return this.policyService.createShareLink(undefined, body?.expiresAt, req.user.userId || req.user.id);
    }
    async createShareLink(id, req, body) {
        return this.policyService.createShareLink(id, body?.expiresAt, req.user.userId || req.user.id);
    }
    async getPublicPolicy(token) {
        return this.policyService.getPublicPolicy(token);
    }
    async signPublicPolicy(token, body, req) {
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        return this.policyService.signPublicPolicy(token, body.name, body.email, body.policyId, ip, userAgent);
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
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
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
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "createShareAllLink", null);
__decorate([
    (0, common_1.Post)(':id/share'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
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
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "signPublicPolicy", null);
exports.PolicyController = PolicyController = __decorate([
    (0, common_1.Controller)('policies'),
    __metadata("design:paramtypes", [policy_service_1.PolicyService,
        prisma_service_1.PrismaService])
], PolicyController);
//# sourceMappingURL=policy.controller.js.map
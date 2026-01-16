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
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ComplianceService = class ComplianceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const standards = await this.prisma.complianceStandard.findMany({
            include: {
                controls: {
                    orderBy: { code: 'asc' },
                    include: {
                        gaps: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
        return standards.map(std => {
            const mappedControls = std.controls.map(c => ({
                id: c.id,
                code: c.code,
                name: c.name,
                description: c.description,
                status: c.gaps[0]?.status || 'PENDING'
            }));
            const total = mappedControls.length;
            const passed = mappedControls.filter(c => c.status === 'COMPLIANT').length;
            const score = total > 0 ? Math.round((passed / total) * 100) : 0;
            return {
                id: std.id,
                name: std.name,
                description: std.description,
                complianceScore: score,
                controls: mappedControls
            };
        });
    }
    async getSummary() {
        const standards = await this.prisma.complianceStandard.findMany({
            include: {
                controls: {
                    include: {
                        gaps: true,
                    },
                },
            },
        });
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
                const latestGap = ctrl.gaps[0];
                if (latestGap && latestGap.status === 'COMPLIANT') {
                    passedCount++;
                }
            });
            const progress = Math.round((passedCount / totalControls) * 100);
            let status = 'Riskli';
            if (progress >= 80)
                status = 'İyi Durumda';
            else if (progress >= 50)
                status = 'Geliştirilmeli';
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
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map
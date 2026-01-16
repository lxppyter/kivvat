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
exports.EvidenceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const report_service_1 = require("../report/report.service");
let EvidenceService = class EvidenceService {
    prisma;
    reportService;
    constructor(prisma, reportService) {
        this.prisma = prisma;
        this.reportService = reportService;
    }
    async collectEvidence(provider) {
        const mockResult = {
            status: 'NON_COMPLIANT',
            details: 'Bucket kivvat-sensitive-data has Public Access Block DISABLED.',
            resourceId: 'kivvat-sensitive-data',
            severity: 'HIGH'
        };
        await new Promise((resolve) => setTimeout(resolve, 500));
        const evidence = await this.prisma.evidence.create({
            data: {
                source: provider,
                checkName: 'S3 Public Access Check',
                resourceId: mockResult.resourceId,
                result: mockResult,
            },
        });
        try {
            const screenshotPath = await this.reportService.generateEvidenceScreenshot(evidence);
            const updated = await this.prisma.evidence.update({
                where: { id: evidence.id },
                data: { screenshotPath }
            });
            console.log(`[Evidence] Collected & Screenshot from ${provider}:`, updated);
            return updated;
        }
        catch (e) {
            console.error('Screenshot Failed:', e);
            return evidence;
        }
    }
    async getHistory(controlId) {
        return this.prisma.evidence.findMany({
            where: {
                gaps: {
                    some: {
                        controlId: controlId
                    }
                }
            },
            include: {
                gaps: true
            },
            orderBy: {
                timestamp: 'desc'
            },
            take: 10
        });
    }
    async getEvidence(id) {
        return this.prisma.evidence.findUnique({
            where: { id },
            include: {
                gaps: {
                    include: {
                        control: {
                            include: {
                                standard: true
                            }
                        }
                    }
                }
            }
        });
    }
};
exports.EvidenceService = EvidenceService;
exports.EvidenceService = EvidenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, report_service_1.ReportService])
], EvidenceService);
//# sourceMappingURL=evidence.service.js.map
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
exports.AnalysisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const task_service_1 = require("../task/task.service");
let AnalysisService = class AnalysisService {
    prisma;
    taskService;
    constructor(prisma, taskService) {
        this.prisma = prisma;
        this.taskService = taskService;
    }
    async analyzeEvidence(evidence) {
        let standard = await this.prisma.complianceStandard.findUnique({
            where: { name: 'ISO 27001' },
        });
        if (!standard) {
            standard = await this.prisma.complianceStandard.create({
                data: {
                    name: 'ISO 27001',
                    description: 'Information Security Management',
                },
            });
        }
        let control = await this.prisma.control.findFirst({
            where: { code: 'A.9.1' }
        });
        if (!control) {
            control = await this.prisma.control.create({
                data: {
                    standardId: standard.id,
                    code: 'A.9.1',
                    name: 'Access Control',
                    description: 'Limit access to information and information processing facilities.'
                }
            });
        }
        let status = 'PENDING';
        let details = '';
        if (evidence.checkName === 'S3 Public Access Check') {
            const result = evidence.result;
            if (result.publicAccessBlock === false) {
                status = 'NON_COMPLIANT';
                details = `Bucket ${result.bucketName} is publicly accessible via ACLs or Policies.`;
            }
            else {
                status = 'COMPLIANT';
                details = `Bucket ${result.bucketName} is secure.`;
            }
        }
        const gap = await this.prisma.gapAnalysis.create({
            data: {
                controlId: control.id,
                evidenceId: evidence.id,
                status: status,
                details: details,
            },
        });
        console.log(`[Analysis] Gap Created: ${status} for ${evidence.checkName}`);
        if (status === 'NON_COMPLIANT') {
            await this.taskService.createRemediationTask(gap);
        }
        return gap;
    }
};
exports.AnalysisService = AnalysisService;
exports.AnalysisService = AnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        task_service_1.TaskService])
], AnalysisService);
//# sourceMappingURL=analysis.service.js.map
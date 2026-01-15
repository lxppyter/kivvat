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
let EvidenceService = class EvidenceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async collectEvidence(provider) {
        const mockResult = {
            bucketName: 'kivvat-sensitive-data',
            publicAccessBlock: false,
        };
        await new Promise((resolve) => setTimeout(resolve, 500));
        const evidence = await this.prisma.evidence.create({
            data: {
                source: provider,
                checkName: 'S3 Public Access Check',
                result: mockResult,
            },
        });
        console.log(`[Evidence] Collected from ${provider}:`, evidence);
        return evidence;
    }
};
exports.EvidenceService = EvidenceService;
exports.EvidenceService = EvidenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvidenceService);
//# sourceMappingURL=evidence.service.js.map
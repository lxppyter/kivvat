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
exports.EvidenceController = void 0;
const common_1 = require("@nestjs/common");
const evidence_service_1 = require("./evidence.service");
const analysis_service_1 = require("../analysis/analysis.service");
let EvidenceController = class EvidenceController {
    evidenceService;
    analysisService;
    constructor(evidenceService, analysisService) {
        this.evidenceService = evidenceService;
        this.analysisService = analysisService;
    }
    async runScan(provider = 'AWS') {
        const evidence = await this.evidenceService.collectEvidence(provider);
        const gap = await this.analysisService.analyzeEvidence(evidence);
        return {
            message: 'Scan completed',
            evidence,
            gap,
        };
    }
};
exports.EvidenceController = EvidenceController;
__decorate([
    (0, common_1.Post)('scan'),
    __param(0, (0, common_1.Body)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EvidenceController.prototype, "runScan", null);
exports.EvidenceController = EvidenceController = __decorate([
    (0, common_1.Controller)('evidence'),
    __metadata("design:paramtypes", [evidence_service_1.EvidenceService,
        analysis_service_1.AnalysisService])
], EvidenceController);
//# sourceMappingURL=evidence.controller.js.map
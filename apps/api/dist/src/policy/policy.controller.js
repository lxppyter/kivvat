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
let PolicyController = class PolicyController {
    policyService;
    constructor(policyService) {
        this.policyService = policyService;
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
    async updatePolicy(id, content) {
        return this.policyService.updatePolicy(id, content);
    }
    async getHistory(id) {
        return this.policyService.getHistory(id);
    }
};
exports.PolicyController = PolicyController;
__decorate([
    (0, common_1.Get)('templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('assignments'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getAssignments", null);
__decorate([
    (0, common_1.Get)('download/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "downloadTemplate", null);
__decorate([
    (0, common_1.Post)('sign/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "signPolicy", null);
__decorate([
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "updatePolicy", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getHistory", null);
exports.PolicyController = PolicyController = __decorate([
    (0, common_1.Controller)('policies'),
    __metadata("design:paramtypes", [policy_service_1.PolicyService])
], PolicyController);
//# sourceMappingURL=policy.controller.js.map
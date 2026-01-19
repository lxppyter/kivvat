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
exports.ScannerController = void 0;
const common_1 = require("@nestjs/common");
const scanner_service_1 = require("./scanner.service");
const passport_1 = require("@nestjs/passport");
const subscription_guard_1 = require("../common/guards/subscription.guard");
let ScannerController = class ScannerController {
    scannerService;
    constructor(scannerService) {
        this.scannerService = scannerService;
    }
    async getReports(req) {
        return this.scannerService.getReports(req.user.userId);
    }
    async syncAssets(req, body) {
        return this.scannerService.syncAssets(req.user.userId, body.credentials);
    }
    async getAssets(req) {
        return this.scannerService.getAssets(req.user.userId);
    }
    async runScan(body, req) {
        console.log('User in Controller:', req.user);
        const userId = req.user?.userId;
        const plan = req.user?.plan || 'FREE';
        if (!userId)
            throw new Error('User ID missing from request');
        const creds = body.credentials || {};
        return this.scannerService.runScan(body.provider, creds, userId, plan);
    }
};
exports.ScannerController = ScannerController;
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScannerController.prototype, "getReports", null);
__decorate([
    (0, common_1.Post)('assets/sync'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScannerController.prototype, "syncAssets", null);
__decorate([
    (0, common_1.Get)('assets'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScannerController.prototype, "getAssets", null);
__decorate([
    (0, common_1.Post)('run'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScannerController.prototype, "runScan", null);
exports.ScannerController = ScannerController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), subscription_guard_1.SubscriptionGuard),
    (0, common_1.Controller)('scanner'),
    __metadata("design:paramtypes", [scanner_service_1.ScannerService])
], ScannerController);
//# sourceMappingURL=scanner.controller.js.map
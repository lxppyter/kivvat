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
exports.CloudController = void 0;
const common_1 = require("@nestjs/common");
const cloud_service_1 = require("./cloud.service");
const passport_1 = require("@nestjs/passport");
const asset_service_1 = require("../asset/asset.service");
let CloudController = class CloudController {
    cloudService;
    assetService;
    constructor(cloudService, assetService) {
        this.cloudService = cloudService;
        this.assetService = assetService;
    }
    async connect(provider, credentials, req) {
        const user = req.user;
        const currentCount = await this.assetService.countByType(user.userId, 'ACCOUNT');
        let limit = 0;
        if (user.plan === 'CORE')
            limit = 1;
        else if (user.plan === 'PRO')
            limit = 3;
        else if (user.plan === 'ENTERPRISE')
            limit = 999;
        const p = provider.toLowerCase();
        if (p === 'azure' && !['PRO', 'ENTERPRISE'].includes(user.plan)) {
            throw new common_1.ForbiddenException("Azure bağlantısı sadece Trust Architect (PRO) ve üzeri paketlerde mevcuttur.");
        }
        if (p === 'gcp' && user.plan !== 'ENTERPRISE') {
            throw new common_1.ForbiddenException("GCP bağlantısı sadece Total Authority (ENTERPRISE) paketinde mevcuttur.");
        }
        if (currentCount >= limit) {
            throw new common_1.ForbiddenException(`Plan limitinize ulaştınız (${limit} Bulut Hesabı). Lütfen paketinizi yükseltin.`);
        }
        const result = await this.cloudService.connect(provider, credentials);
        await this.assetService.create(user.userId, {
            provider: provider.toUpperCase(),
            type: 'ACCOUNT',
            name: `${provider.toUpperCase()} Connection`,
            details: { verified: true, connectedAt: new Date() },
            status: 'ACTIVE'
        });
        return result;
    }
};
exports.CloudController = CloudController;
__decorate([
    (0, common_1.Post)('connect/:provider'),
    __param(0, (0, common_1.Param)('provider')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CloudController.prototype, "connect", null);
exports.CloudController = CloudController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('cloud'),
    __metadata("design:paramtypes", [cloud_service_1.CloudService,
        asset_service_1.AssetService])
], CloudController);
//# sourceMappingURL=cloud.controller.js.map
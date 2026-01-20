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
exports.AssetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssetService = class AssetService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        return this.prisma.asset.findMany({
            where: { userId },
            orderBy: [
                { type: 'asc' },
                { name: 'asc' }
            ]
        });
    }
    async countByType(userId, type) {
        return this.prisma.asset.count({
            where: { userId, type }
        });
    }
    async create(userId, data) {
        return this.prisma.asset.create({
            data: {
                ...data,
                userId
            }
        });
    }
    async createMany(userId, data) {
        return this.prisma.asset.createMany({
            data: data.map(item => ({
                ...item,
                userId
            }))
        });
    }
    async update(id, data) {
        const currentAsset = await this.prisma.asset.findUnique({
            where: { id },
        });
        if (!currentAsset) {
            throw new Error('Asset not found');
        }
        const oldConfigStr = JSON.stringify(currentAsset.details);
        const newConfigStr = JSON.stringify(data.details || currentAsset.details);
        if (data.details && oldConfigStr !== newConfigStr) {
            await this.prisma.assetHistory.create({
                data: {
                    assetId: id,
                    oldConfig: currentAsset.details || {},
                    newConfig: data.details,
                    diff: this.calculateDiff(currentAsset.details, data.details),
                    changedBy: 'SYSTEM',
                }
            });
        }
        return this.prisma.asset.update({
            where: { id },
            data
        });
    }
    async getHistory(assetId) {
        return this.prisma.assetHistory.findMany({
            where: { assetId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async remove(id) {
        return this.prisma.asset.delete({
            where: { id }
        });
    }
    calculateDiff(obj1, obj2) {
        const diff = {};
        const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
        allKeys.forEach(key => {
            if (JSON.stringify(obj1?.[key]) !== JSON.stringify(obj2?.[key])) {
                diff[key] = {
                    old: obj1?.[key],
                    new: obj2?.[key]
                };
            }
        });
        return diff;
    }
};
exports.AssetService = AssetService;
exports.AssetService = AssetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetService);
//# sourceMappingURL=asset.service.js.map
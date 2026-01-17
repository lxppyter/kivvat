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
        return this.prisma.asset.update({
            where: { id },
            data
        });
    }
    async remove(id) {
        return this.prisma.asset.delete({
            where: { id }
        });
    }
};
exports.AssetService = AssetService;
exports.AssetService = AssetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetService);
//# sourceMappingURL=asset.service.js.map
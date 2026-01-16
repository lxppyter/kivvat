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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TaskService = class TaskService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                gapAnalysisId: dto.gapAnalysisId,
                assigneeId: dto.assigneeId,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            },
        });
    }
    async createRemediationTask(gap) {
        return this.prisma.task.create({
            data: {
                title: `Fix Compliance Issue: ${gap.evidenceId || gap.id}`,
                description: `Automated remediation task for control ${gap.control?.code || 'Unknown'}. Detail: ${gap.details}`,
                gapAnalysisId: gap.id,
                status: 'OPEN',
            },
        });
    }
    async findAll() {
        return this.prisma.task.findMany({
            include: {
                assignee: {
                    select: { id: true, name: true, email: true },
                },
                gapAnalysis: {
                    include: {
                        control: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: { assignee: true, gapAnalysis: true },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return task;
    }
    async update(id, dto) {
        return this.prisma.task.update({
            where: { id },
            data: {
                ...dto,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            },
        });
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaskService);
//# sourceMappingURL=task.service.js.map
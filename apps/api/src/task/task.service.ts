import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
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

  async createRemediationTask(gap: any) { // Using any or specific type if available, gap is GapAnalysis
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

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { assignee: true, gapAnalysis: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }
}

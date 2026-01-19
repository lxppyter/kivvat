import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateIncidentDto) {
    return this.prisma.incident.create({
      data: {
        ...dto,
        userId,
        status: dto.status || 'OPEN',
        source: 'MANUAL',
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.incident.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const incident = await this.prisma.incident.findFirst({
      where: { id, userId },
    });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async update(id: string, userId: string, dto: UpdateIncidentDto) {
    // Verify ownership
    await this.findOne(id, userId);

    return this.prisma.incident.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    // Verify ownership
    await this.findOne(id, userId);

    return this.prisma.incident.delete({
      where: { id },
    });
  }
}

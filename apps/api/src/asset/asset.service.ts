import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.asset.findMany({
      where: { userId },
      orderBy: [
        { type: 'asc' }, // Group by type roughly
        { name: 'asc' }
      ]
    });
  }

  async create(userId: string, data: any) {
    return this.prisma.asset.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async createMany(userId: string, data: any[]) {
    // Basic bulk insert
    // Note: createMany is not supported with SQLite if that was used, but we are on Postgres.
    // However, createMany doesn't return created records in all prisma versions/adapters essentially.
    // But for this use case, we just want to fire and forget or receive a count.
    return this.prisma.asset.createMany({
      data: data.map(item => ({
        ...item,
        userId
      }))
    });
  }

  async update(id: string, data: any) {
    return this.prisma.asset.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    return this.prisma.asset.delete({
      where: { id }
    });
  }
}

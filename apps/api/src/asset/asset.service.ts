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
}

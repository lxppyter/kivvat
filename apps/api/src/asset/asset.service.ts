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

  async countByType(userId: string, type: string) {
    return this.prisma.asset.count({
      where: { userId, type }
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
    // 1. Fetch current consistency
    const currentAsset = await this.prisma.asset.findUnique({
        where: { id },
    });

    if (!currentAsset) {
        throw new Error('Asset not found');
    }

    // 2. Detect Drift
    // Simple deep comparison via JSON stringify for this MVP
    // In production, use 'deep-diff' or 'fast-deep-equal'
    const oldConfigStr = JSON.stringify(currentAsset.details);
    const newConfigStr = JSON.stringify(data.details || currentAsset.details);

    if (data.details && oldConfigStr !== newConfigStr) {
        // Create History Record (Drift Detected)
        await this.prisma.assetHistory.create({
            data: {
                assetId: id,
                oldConfig: currentAsset.details || {},
                newConfig: data.details,
                diff: this.calculateDiff(currentAsset.details, data.details),
                changedBy: 'SYSTEM', // Or pass userId if available
            }
        });
    }

    return this.prisma.asset.update({
      where: { id },
      data
    });
  }

  async getHistory(assetId: string) {
      return this.prisma.assetHistory.findMany({
          where: { assetId },
          orderBy: { createdAt: 'desc' }
      });
  }

  async remove(id: string) {
    return this.prisma.asset.delete({
      where: { id }
    });
  }

  // Simple diff helper for MVP
  private calculateDiff(obj1: any, obj2: any): any {
      // Very basic diff: return keys that are different
      // Real implementation would use a proper library
      const diff: any = {};
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
}

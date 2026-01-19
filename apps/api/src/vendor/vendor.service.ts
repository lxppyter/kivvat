import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateVendorDto) {
    return this.prisma.vendor.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.vendor.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string) {
    const vendor = await this.prisma.vendor.findFirst({ where: { id, userId } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    return this.prisma.vendor.delete({ where: { id } });
  }
}

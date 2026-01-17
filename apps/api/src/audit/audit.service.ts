import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming global prisma service or similar
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async createShareLink(userId: string, name: string, expiresInHours: number) {
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const share = await this.prisma.auditShare.create({
      data: {
        token,
        name,
        expiresAt,
        userId
      }
    });

    return {
      shareLink: `/audit/access/${token}`,
      token: token,
      expiresAt
    };
  }

  async verifyShareToken(token: string) {
    const share = await this.prisma.auditShare.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!share) {
      throw new UnauthorizedException('Invalid audit token');
    }

    if (new Date() > share.expiresAt) {
      throw new UnauthorizedException('Audit token expired');
    }

    return share;
  }

  async createAuditorToken(share: any) {
    // Impersonate the user for data access, but set role to AUDITOR
    const payload = { 
      sub: share.userId, 
      email: share.user.email,
      role: 'AUDITOR',
      auditShareId: share.id 
    };
    
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET || 'super-secret-key-change-me', expiresIn: '2h' }), // Short lived session
      user: {
          id: share.userId,
          name: share.user.name,
          email: share.user.email,
          role: 'AUDITOR'
      }
    };
  }
  async getMyShares(userId: string) {
    return this.prisma.auditShare.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async revokeShare(userId: string, shareId: string) {
    const result = await this.prisma.auditShare.deleteMany({
      where: {
        id: shareId,
        userId: userId
      }
    });
    return { count: result.count };
  }
}

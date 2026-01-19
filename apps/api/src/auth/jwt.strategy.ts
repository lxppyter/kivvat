import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-change-me',
    });
  }

  async validate(payload: any) {
    // SECURITY CHECK: If this is an AUDITOR token, verify the share link still exists
    if (payload.role === 'AUDITOR' && payload.auditShareId) {
       const share = await this.prisma.auditShare.findUnique({
         where: { id: payload.auditShareId }
       });
       
       if (!share) {
         // Share link revoked/deleted -> Invalid Token
         throw new UnauthorizedException('Audit access has been revoked.');
       }
    }

    // Normal behavior (including successful auditor check)
    return {
      userId: payload.sub,
      id: payload.sub,
      email: payload.email,
      role: payload.role || 'STAFF', // Default to STAFF if undefined (legacy tokens)
    };
  }
}

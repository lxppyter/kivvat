import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({}),
    PrismaModule,
  ],
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
